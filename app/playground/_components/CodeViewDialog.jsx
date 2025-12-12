'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'

function CodeViewDialog({ open, onOpenChange, code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast.error('Failed to copy code')
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-8">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Generated Code
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your generated HTML code with all styles and scripts included
              </DialogDescription>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 items-center">
            <Button
              variant="default"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </Button>
            <div className="text-xs text-gray-500 flex items-center">
              {code?.length || 0} characters
            </div>
          </div>
        </div>
        
        {/* Code Display */}
        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            showLineNumbers
            wrapLines
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              background: '#1e1e1e',
              minHeight: '100%',
            }}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#858585',
              userSelect: 'none',
            }}
          >
            {code || '// No code generated yet'}
          </SyntaxHighlighter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CodeViewDialog