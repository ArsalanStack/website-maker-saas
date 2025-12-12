'use client'
import React, { useState, useRef, useEffect, useContext } from 'react'
import WebPageTool from './WebPageTool'
import SettingsSection from './SettingsSection'
import ImageSettingsSection from './ImageSettingsSecction'
import { OnsaveContext } from '@/Context/OnSaveContext'
import axios from 'axios'
import { toast } from 'sonner'
import { useParams, useSearchParams } from 'next/navigation'

const WebsiteDesign = ({ generatedCode, onCodeUpdate, isBuilding }) => {
  const [selectedScreenSize, setSelectedScreenSize] = useState('web')
  const [editMode, setEditMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [isImageElement, setIsImageElement] = useState(false)
  const [currentCode, setCurrentCode] = useState(generatedCode)
  const [isSaving, setIsSaving] = useState(false)
  const iframeRef = useRef(null)
  const selectedElRef = useRef(null)
  const hoverElRef = useRef(null)
  const prevCodeLengthRef = useRef(0)
  const updateTimeoutRef = useRef(null)
  const lastUpdateTimeRef = useRef(0)
  const pendingCodeRef = useRef(null)

  const { onSaveData, setOnSaveData } = useContext(OnsaveContext);
  const { projectId } = useParams()
  const params = useSearchParams()
  const frameId = params.get('frameId')

  // Smooth, debounced iframe updates
  const updateIframeContent = (newCode) => {
    if (!iframeRef.current) return
    
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
      if (!iframeDoc || !iframeDoc.body) return
      
      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        try {
          // Update body content smoothly
          iframeDoc.body.innerHTML = newCode
          
          // Batch re-initialize libraries
          if (typeof AOS !== 'undefined' && AOS.init) {
            try { AOS.refresh() } catch (e) { }
          }
          if (typeof Flowbite !== 'undefined' && Flowbite.init) {
            try { Flowbite.init() } catch (e) { }
          }
          if (typeof tippy !== 'undefined' && tippy.hideAll) {
            try { tippy.hideAll() } catch (e) { }
          }
          
          // Smooth scroll to show new content with multiple fallbacks
          requestAnimationFrame(() => {
            try {
              const scrollHeight = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight
              const windowHeight = iframeDoc.documentElement.clientHeight || iframeDoc.body.clientHeight
              
              if (scrollHeight > windowHeight) {
                // Smooth scroll to bottom
                iframeDoc.documentElement.scrollTo({
                  top: scrollHeight,
                  behavior: 'smooth'
                })
              }
            } catch (e) { 
              // Fallback: direct scroll
              try {
                iframeDoc.documentElement.scrollTop = iframeDoc.documentElement.scrollHeight
              } catch (e2) { }
            }
          })
        } catch (e) {
          console.warn('Error updating iframe:', e)
        }
      })
    } catch (error) {
      console.warn('Could not access iframe:', error)
    }
  }

  // Update local code when generatedCode changes with intelligent debouncing
  useEffect(() => {
    if (!generatedCode) return
    
    setCurrentCode(generatedCode)
    pendingCodeRef.current = generatedCode
    
    // Only update iframe if we have significant growth (prevents micro-updates)
    const codeLengthDiff = generatedCode.length - prevCodeLengthRef.current
    
    if (iframeRef.current && codeLengthDiff > 0) {
      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current
      
      // Minimum time between updates (prevents glitchy rapid updates)
      const minUpdateInterval = 100
      const delayNeeded = Math.max(0, minUpdateInterval - timeSinceLastUpdate)
      
      updateTimeoutRef.current = setTimeout(() => {
        if (pendingCodeRef.current) {
          updateIframeContent(pendingCodeRef.current)
          lastUpdateTimeRef.current = Date.now()
        }
        updateTimeoutRef.current = null
      }, delayNeeded)
    }
    
    prevCodeLengthRef.current = generatedCode.length
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [generatedCode])

  // Get responsive styles based on screen size
  const getIframeContainerStyles = () => {
    switch(selectedScreenSize) {
      case 'mobile':
        return 'flex items-center justify-center bg-gray-50 overflow-y-auto py-8'
      case 'web':
      default:
        return ''
    }
  }

  const getIframeStyles = () => {
    switch(selectedScreenSize) {
      case 'mobile':
        return 'w-[375px] h-[667px] rounded-xl shadow-2xl border-[12px] border-gray-900 flex-shrink-0'
      case 'web':
      default:
        return 'w-full h-full'
    }
  }

  // Clear selection function
  const clearSelection = () => {
    if (selectedElRef.current) {
      selectedElRef.current.style.outline = ""
      selectedElRef.current.removeAttribute("contenteditable")
      selectedElRef.current = null
      setSelectedElement(null)
      setIsImageElement(false)
    }
  }

  // Save current iframe content when toggling edit mode
  const handleEditModeToggle = (enabled) => {
    if (!enabled && iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc && doc.body) {
        const updatedHTML = doc.body.innerHTML
        setCurrentCode(updatedHTML)
        console.log('💾 Code updated in state')
      }
      clearSelection()
    }
    setEditMode(enabled)
  }

  // Element selection and editing logic - only setup when edit mode changes
  useEffect(() => {
    if (!iframeRef.current || !currentCode || !editMode) {
      clearSelection()
      return
    }

    const iframe = iframeRef.current
    let eventListenersAdded = false
    
    const setupEditor = () => {
      if (eventListenersAdded) return // Prevent duplicate listeners
      
      const doc = iframe.contentDocument
      if (!doc || !doc.body) return

      const handleMouseOver = (e) => {
        if (selectedElRef.current) return
        
        const target = e.target
        if (!target || target === doc.body) return

        if (hoverElRef.current && hoverElRef.current !== target) {
          hoverElRef.current.style.outline = ""
        }
        
        hoverElRef.current = target
        hoverElRef.current.style.outline = "2px dashed #3b82f6"
        hoverElRef.current.style.outlineOffset = "2px"
      }

      const handleMouseOut = (e) => {
        if (selectedElRef.current) return
        
        if (hoverElRef.current) {
          hoverElRef.current.style.outline = ""
          hoverElRef.current = null
        }
      }

      const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const target = e.target
        if (!target || target === doc.body) return

        if (selectedElRef.current && selectedElRef.current !== target) {
          selectedElRef.current.style.outline = ""
          selectedElRef.current.removeAttribute("contenteditable")
        }

        selectedElRef.current = target
        selectedElRef.current.style.outline = "2px solid #ef4444"
        selectedElRef.current.style.outlineOffset = "2px"
        
        const isImage = target.tagName.toLowerCase() === 'img'
        setIsImageElement(isImage)
        
        if (!isImage) {
          selectedElRef.current.setAttribute("contenteditable", "true")
          selectedElRef.current.focus()
        }

        setSelectedElement(target)
        console.log("✅ Selected element:", selectedElRef.current.tagName, isImage ? '(Image)' : '')
      }

      const handleBlur = (e) => {
        if (selectedElRef.current) {
          console.log("✏️ Element edited")
        }
      }

      const handleKeyDown = (e) => {
        if (e.key === "Escape" && selectedElRef.current) {
          clearSelection()
        }
      }

      doc.body.addEventListener("mouseover", handleMouseOver)
      doc.body.addEventListener("mouseout", handleMouseOut)
      doc.body.addEventListener("click", handleClick)
      doc.addEventListener("keydown", handleKeyDown)
      doc.body.addEventListener("blur", handleBlur, true)
      
      eventListenersAdded = true

      return () => {
        doc.body?.removeEventListener("mouseover", handleMouseOver)
        doc.body?.removeEventListener("mouseout", handleMouseOut)
        doc.body?.removeEventListener("click", handleClick)
        doc?.removeEventListener("keydown", handleKeyDown)
        doc.body?.removeEventListener("blur", handleBlur, true)
      }
    }

    const checkIframeReady = () => {
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        return setupEditor()
      }
    }

    iframe.addEventListener('load', checkIframeReady)
    const cleanup = checkIframeReady()

    return () => {
      iframe.removeEventListener('load', checkIframeReady)
      if (cleanup) cleanup()
      
      selectedElRef.current = null
      hoverElRef.current = null
      eventListenersAdded = false
    }
  }, [editMode])

  // Save code to database
  const onSaveCode = async () => {
    if (isSaving) {
      console.log('⚠️ Save already in progress')
      return
    }

    let codeToSave = currentCode

    // Get latest code from iframe if it's available
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc && doc.body) {
        const updatedHTML = doc.body.innerHTML
        codeToSave = updatedHTML
        setCurrentCode(updatedHTML)
        console.log('💾 Code extracted from iframe')
      }
    }

    if (!codeToSave || !frameId || !projectId) {
      console.log('⚠️ Missing required data for saving code')
      toast.error('Cannot save: Missing required data')
      return
    }

    try {
      setIsSaving(true)
      console.log('🔄 Saving design code...')
      
      await axios.put('/api/frames', {
        frameId: frameId,
        designCode: codeToSave,
        projectId: projectId
      })
      
      toast.success('Design saved successfully! 🎉')
      console.log('✅ Design code saved successfully')
      
      // Call parent callback if provided
      if (onCodeUpdate) {
        onCodeUpdate(codeToSave)
      }
    } catch (error) {
      console.error('❌ Error saving design code:', error)
      toast.error('Failed to save design. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Listen for save trigger from context
  useEffect(() => {
    if (onSaveData) {
      console.log('💾 Save triggered from header button')
      onSaveCode()
    }
  }, [onSaveData])

  return (
    <div className='flex h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Main Content Area - Full width when edit mode OFF, 60% when ON */}
      <div 
        className={`${editMode ? 'w-[60%]' : 'w-full'} flex flex-col transition-all duration-500 ease-in-out`}
      >
        {currentCode ? (
          <div className="flex flex-col h-full">
            {/* Top Bar - Edit Mode Toggle */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Edit Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMode}
                      onChange={(e) => handleEditModeToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 shadow-inner"></div>
                  </label>
                </div>
                {editMode && (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-3 h-3 border-2 border-dashed border-blue-500 rounded"></div>
                      <span className="text-blue-700 font-medium">Hover</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-3 h-3 border-2 border-red-500 rounded"></div>
                      <span className="text-red-700 font-medium">Selected</span>
                    </div>
                    {selectedElement && (
                      <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium shadow-sm">
                        {isImageElement ? '🖼️ Image' : `📝 ${selectedElement.tagName.toLowerCase()}`}
                      </div>
                    )}
                    <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-medium">
                      ESC to deselect
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Container - Takes remaining space */}
            <div className={`flex-1 relative overflow-hidden ${getIframeContainerStyles()}`}>
              {/* Building indicator (shows during AI generation/streaming) */}
              {isBuilding && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                  <div className="flex items-center gap-3 bg-white/90 text-gray-700 px-3 py-2 rounded-full shadow-lg">
                    <div className="w-3 h-3 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Building preview…</span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                srcDoc={`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Website Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://unpkg.com/flowbite@1.6.6/dist/flowbite.min.css" rel="stylesheet" />
  <script src="https://unpkg.com/flowbite@1.6.6/dist/flowbite.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/swiper@8/swiper-bundle.min.css" />
  <script src="https://unpkg.com/swiper@8/swiper-bundle.min.js"></script>
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
  <script src="https://unpkg.com/tippy.js@6"></script>
  <style>
    html, body { 
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      font-family: system-ui, -apple-system, sans-serif;
      scroll-behavior: smooth;
      will-change: contents;
    }
    * {
      box-sizing: border-box;
    }
    body {
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0.95;
      }
      to {
        opacity: 1;
      }
    }
    ${editMode ? `
    [contenteditable="true"] {
      cursor: text !important;
    }
    [contenteditable="true"]:focus {
      outline: 2px solid #ef4444 !important;
      outline-offset: 2px !important;
    }
    img {
      cursor: pointer !important;
    }
    ` : ''}
  </style>
</head>
<body>
${currentCode}
<script>
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  if (typeof tippy !== 'undefined') {
    tippy('[data-tippy-content]', {
      placement: 'top',
      animation: 'fade',
    });
  }
  if (typeof Flowbite !== 'undefined') {
    Flowbite.init();
  }
</script>
</body>
</html>`}
                className={`${getIframeStyles()} border-0 ${editMode ? 'cursor-crosshair' : ''} transition-opacity duration-200`}
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
              />
              
              {/* Saving Indicator */}
              {isSaving && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse z-50">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Saving...</span>
                </div>
              )}
            </div>
            
            {/* Bottom Toolbar - ALWAYS visible */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-6 py-3">
              <WebPageTool 
                selectedScreenSize={selectedScreenSize} 
                setSelectedScreenSize={setSelectedScreenSize}
                generatedCode={currentCode}
              />
            </div>
          </div>
        ) : (
          // Empty State
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <div className="mb-8 relative">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                No Preview Yet
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                Describe your website design in the chat, and watch it come to life here in real-time! ✨
              </p>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="font-medium">Waiting for your input</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel - ONLY renders when edit mode is enabled */}
      {editMode && (
        <div className="w-[40%] bg-white border-l border-gray-200/50 shadow-2xl overflow-y-auto">
          {isImageElement ? (
            <ImageSettingsSection 
              selectedEl={selectedElement}
              clearSelection={clearSelection}
            />
          ) : (
            <SettingsSection 
              selectedEl={selectedElement}
              clearSelection={clearSelection}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default WebsiteDesign