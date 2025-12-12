'use client'
import React, { useEffect, useState, useRef } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'

const DesignPrompt = `userInput: {userInput}

**IMPORTANT: Analyze the user's request first:**
1. If the user mentions "Flowbite" or specifically requests Flowbite components, use Flowbite UI library extensively.
2. If the user requests a specific UI framework or library (Bootstrap, Material UI, etc.), use that framework instead.
3. If no specific framework is mentioned, create a **minimalist, modern, and professional** design using pure Tailwind CSS with clean aesthetics, ample white space, elegant typography, and subtle interactions.
4. If the user asks for only a single component (e.g., "just give me a button" or "create a card component"), generate ONLY that component with minimal surrounding HTML.
5. Match the design style to the user's industry or use case (e.g., corporate/professional for business sites, creative/bold for portfolios, clean/minimal for SaaS products).

**Core Requirements:**
- Generate complete, production-ready HTML using Tailwind CSS for styling
- Do NOT include <html>, <head>, or <title> tags — start directly with the <body> content
- Make the design fully responsive with proper breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Ensure all interactive elements are functional and accessible (proper ARIA labels, keyboard navigation support)
- Add proper padding, margin, and spacing using Tailwind's spacing scale (p-4, m-6, space-y-8, etc.)
- Components should be self-contained and independent — avoid tight coupling between sections
- Include working mobile navigation with a hamburger menu if navigation is present
- Use semantic HTML5 elements (<header>, <nav>, <main>, <section>, <article>, <footer>)

**Image Handling (CRITICAL):**
- Use placeholder images from:
  - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
  - Dark mode: https://www.cibaky.com/wp-content/uploads/2X/placeholder-3.jpg
- **Every <img> tag MUST have a highly detailed, AI-image-generation-ready prompt as the alt attribute**
- Alt text structure: "[Subject/Person] + [Action/Pose] + [Environment/Background] + [Lighting] + [Color Palette] + [Mood/Emotion] + [Style: photorealistic/illustration/3D/vector/oil painting] + [Camera Details: angle, lens, depth of field] + [Additional props/clothing/details]"
- Example alt texts:
  - "Professional woman in navy blue business suit presenting to team, modern glass-walled office background, natural daylight from large windows, cool blue and white color palette, confident expression, photorealistic, eye-level shot, 50mm lens, shallow depth of field"
  - "Minimalist smartphone mockup floating at 45-degree angle, clean white studio background, soft diffused lighting from top-left, white and silver color palette, modern tech aesthetic, 3D render, isometric view, high-key lighting"
  - "Cozy home office setup with MacBook and coffee mug on wooden desk, warm afternoon sunlight streaming through window, plants in background, warm brown and green tones, inviting atmosphere, photorealistic, overhead shot, 35mm lens"
- If user describes images in their request, transform their description into this detailed format
- Never use generic alts like "image", "photo", "placeholder" — always be highly specific

**Design Principles:**
- **Minimalist approach**: Clean layouts, generous white space, focused content hierarchy
- **Professional aesthetics**: Modern typography (system fonts or Google Fonts), consistent color palette
- **Subtle interactions**: Smooth hover states, gentle transitions (transition-all duration-300), micro-animations
- **Visual hierarchy**: Clear heading structure (text-4xl, text-2xl, text-lg), proper line heights, readable body text (text-base)
- **Color psychology**: Choose colors appropriate to the content (blue for trust/tech, green for health/eco, purple for creativity, etc.)
- **Accessibility**: High contrast ratios (WCAG AA minimum), proper focus states, descriptive labels

**Available Libraries (already installed — do not add CDN links):**
- Tailwind CSS (utility classes)
- Flowbite (only if user requests it or mentions it)
- Font Awesome 6 (icons: <i class="fa-solid fa-icon-name"></i>)
- Chart.js (for data visualizations)
- Swiper.js (for carousels/sliders)
- Tippy.js (for tooltips: data-tippy-content="Your tooltip text")
- GSAP (for advanced animations)

**Conditional Component Usage:**
- **Charts/Graphs**: Include Chart.js implementations ONLY if user requests data visualization, analytics, dashboards, or statistics
- **Carousels/Sliders**: Use Swiper.js ONLY if user requests image galleries, testimonial sliders, or product showcases
- **Tooltips**: Add Tippy.js tooltips to icons, help indicators, or complex UI elements that need explanation
- **Animations**: Use GSAP for scroll-triggered animations, page transitions, or complex motion effects — keep subtle and professional
- **Modals**: Include modal dialogs for forms, confirmations, or detailed content views when contextually appropriate
- **Accordions/Tabs**: Use for FAQs, content organization, or information-dense sections
- **Dropdowns**: Add for navigation menus, filters, or selection interfaces


**Dark Mode Requirements:**
- Support both automatic theme detection (prefers-color-scheme) and manual toggle.
- Dark mode must switch the entire UI to a visually consistent dark theme.
- Backgrounds should become darker, while text becomes lighter for proper contrast.
- All components (cards, sections, buttons, inputs, navbars) must adapt to dark mode with appropriate dark surfaces and light text.
- Ensure that contrast remains fully accessible in dark mode.
- Icons, borders, and dividers should also switch to lighter tones for visibility.
- Images must use the dark-mode placeholder URL.
- Hover states, focus states, and active states must remain clearly visible in dark mode.
- Keep layout, spacing, and structure identical in both modes — only tonal values change.


**Responsive Design Requirements:**
- Mobile-first approach: design for mobile (320px+) then enhance for larger screens
- Navigation: Hamburger menu on mobile (< 768px), full horizontal menu on desktop
- Grid layouts: Stack on mobile (grid-cols-1), expand on tablet (md:grid-cols-2), full on desktop (lg:grid-cols-3 or lg:grid-cols-4)
- Typography: Scale text sizes appropriately (text-sm sm:text-base md:text-lg lg:text-xl)
- Images: Full width on mobile, constrained on desktop with object-fit-cover for consistency
- Spacing: Reduce padding/margins on mobile (p-4), increase on desktop (md:p-8 lg:p-12)

**Interactive Elements:**
- Buttons: Include hover effects (hover:bg-blue-600, hover:shadow-lg), active states, disabled styles
- Forms: Proper validation states, error messages, focus rings (focus:ring-2 focus:ring-blue-500)
- Cards: Subtle hover lift effect (hover:shadow-xl hover:-translate-y-1 transition-transform)
- Links: Underline on hover, color change, smooth transitions
- Hamburger menu: Smooth slide-in animation, backdrop overlay, proper close functionality

**Theme & Style Matching:**
- Corporate/Business: Clean blues, grays, professional imagery, structured layouts
- Creative/Agency: Bold colors, asymmetric layouts, large typography, creative imagery
- E-commerce: Product-focused, clear CTAs, trust indicators, review sections
- SaaS/Tech: Modern gradients, feature grids, pricing tables, integration logos
- Portfolio: Image-heavy, project showcases, minimal text, personal branding
- Blog/Content: Readable typography, featured images, related posts, sidebar widgets
- Landing Page: Hero section, benefits, testimonials, pricing, strong CTA

**Code Quality:**
- Use semantic, readable class names
- dark mode means use dark (like: blue, black, gray , etc) background and above it white textor any other suitable color just the background should be dark
- Group Tailwind classes logically (layout → spacing → colors → typography → effects)
- Add comments for complex sections (<!-- Navigation Section -->)
- Ensure all IDs are unique
- Close all tags properly
- Use proper nesting and indentation

**DO NOT:**
- Add <html>, <head>, or <title> tags
- Include CDN links for already-installed libraries
- Use broken or invalid URLs
- Add Lorem Ipsum text (use realistic, contextual placeholder content)
- Include any explanatory text before or after the HTML code
- Add excessive comments (only comment complex logic)
- Use inline styles (use Tailwind classes only)

**OUTPUT FORMAT:**
- Return ONLY the HTML code wrapped in \`\`\`html code blocks
- No preamble, no explanations, no additional text
- Start with <body> or the first semantic element
- Ensure code is production-ready and immediately usable.`


const ConversationSystemPrompt = `You are Arzuno Builder specialized in web design and development. 
You can help users create websites, answer questions about HTML, CSS, Tailwind, and web design.
When users greet you or ask general questions, respond naturally and helpfully.
Only generate HTML code when the user explicitly asks you to create, build, or design something.`

function PlaygroundPage() {
    const [frameDetails, setFrameDetails] = useState()
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [generatedCode, setGeneratedCode] = useState('')
    const isInitialLoad = useRef(true)
    const isSavingMessages = useRef(false)
    const streamingCodeRef = useRef('')

    const { projectId } = useParams()
    const params = useSearchParams()
    const frameId = params.get('frameId')

    useEffect(() => {
        if (frameId) {
            GetFrameDetails()
        }
    }, [frameId])

    const normalizeMessages = (rawMessages) => {
        if (!rawMessages || !Array.isArray(rawMessages)) return []

        return rawMessages.map((msg, index) => {
            if (typeof msg === 'object' && msg.role && msg.content) {
                return msg
            }
            if (typeof msg === 'string') {
                return {
                    role: index % 2 === 0 ? 'user' : 'assistant',
                    content: msg
                }
            }
            return msg
        })
    }

    const isDesignRequest = (input) => {
        const designKeywords = [
            'create', 'build', 'make', 'design', 'generate', 'code',
            'website', 'webpage', 'page', 'landing', 'homepage',
            'form', 'dashboard', 'navbar', 'header', 'footer',
            'section', 'component', 'button', 'card', 'modal',
            'table', 'chart', 'graph', 'slider', 'carousel',
            'login', 'signup', 'register', 'contact', 'about',
            'pricing', 'portfolio', 'blog', 'gallery', 'hero',
            'sidebar', 'menu', 'navigation', 'layout', 'template',
            'html', 'css', 'tailwind', 'ui', 'interface',
            'add', 'update', 'change', 'modify', 'edit', 'fix',
            'remove', 'delete', 'style', 'responsive', 'mobile'
        ]
        
        const lowerInput = input.toLowerCase()
        return designKeywords.some(keyword => lowerInput.includes(keyword))
    }

    const extractHtmlCode = (text) => {
        if (!text) return ''
        
        if (text.includes('```html')) {
            const startIndex = text.indexOf('```html') + 7
            const endIndex = text.indexOf('```', startIndex)
            
            if (endIndex > startIndex) {
                return text.substring(startIndex, endIndex).trim()
            } else {
                return text.substring(startIndex).trim()
            }
        }
        return ''
    }

    const GetFrameDetails = async () => {
        try {
            const result = await axios.get('/api/frames?frameId=' + frameId + "&projectId=" + projectId)
            console.log('🔍 Frame Details:', result.data)

            setFrameDetails(result.data)

            if (result.data.designCode) {
                const extractedCode = extractHtmlCode(result.data.designCode)
                if (extractedCode) {
                    setGeneratedCode(extractedCode)
                } else {
                    setGeneratedCode(result.data.designCode)
                }
                console.log('✅ Loaded existing design code')
            }

            const normalizedMessages = normalizeMessages(result.data.chatMessages)
            setMessages(normalizedMessages)
            
            setTimeout(() => {
                isInitialLoad.current = false
            }, 100)
            
        } catch (error) {
            console.error('❌ Error fetching frame details:', error)
        }
    }

    const parseSSEStream = (chunk) => {
        const lines = chunk.split('\n')
        let content = ''

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6)
                
                if (data === '[DONE]') continue
                
                try {
                    const parsed = JSON.parse(data)
                    const delta = parsed.choices?.[0]?.delta?.content
                    if (delta) {
                        content += delta
                    }
                } catch (e) {
                    // Not valid JSON, might be partial chunk
                }
            }
        }

        return content
    }

    const SendMessage = async (userInput) => {
        console.log('📨 SendMessage called with:', userInput)

        if (!userInput || !userInput.trim()) {
            console.error('❌ No user input provided!')
            return
        }

        setLoading(true)
        streamingCodeRef.current = '' // Reset streaming code

        const newUserMessage = { role: 'user', content: userInput }
        setMessages((prev) => [...prev, newUserMessage])

        try {
            const isDesign = isDesignRequest(userInput)
            console.log('🔍 Is design request:', isDesign)

            let apiMessages = []
            
            if (isDesign) {
                apiMessages = [
                    { role: 'user', content: DesignPrompt.replace('{userInput}', userInput) }
                ]
            } else {
                apiMessages = [
                    { role: 'system', content: ConversationSystemPrompt },
                    { role: 'user', content: userInput }
                ]
            }

            const result = await fetch('/api/ai-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: apiMessages,
                })
            })

            if (!result.ok) {
                throw new Error(`API error: ${result.status}`)
            }

            const reader = result.body.getReader()
            const decoder = new TextDecoder()

            let fullResponse = ''
            let streamBuffer = ''
            let chunkCount = 0
            let lastUpdateLength = 0
            const UPDATE_THRESHOLD = 500 // Only update when code has grown by 500 chars to prevent glitching

            // ✅ Real-time progressive updates with smart batching
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                streamBuffer += chunk

                const parsedContent = parseSSEStream(streamBuffer)
                if (parsedContent) {
                    fullResponse = parsedContent
                    chunkCount++

                    if (isDesign) {
                        // Try to extract fenced HTML first, otherwise accept raw HTML-like content
                        let extractedCode = extractHtmlCode(fullResponse)
                        if (!extractedCode && fullResponse.includes('<')) {
                            // Use the latest fullResponse as HTML if it contains tags
                            extractedCode = fullResponse
                        }

                        if (extractedCode && extractedCode.length > 50) {
                            const codeLengthDiff = extractedCode.length - lastUpdateLength

                            // Only update if code has grown significantly to prevent jank
                            if (codeLengthDiff >= UPDATE_THRESHOLD) {
                                streamingCodeRef.current = extractedCode
                                lastUpdateLength = extractedCode.length
                                console.log(`🔄 Progressive update: +${codeLengthDiff} chars (total: ${extractedCode.length})`)
                                setGeneratedCode(extractedCode)
                            }
                        }
                    }
                }
            }

            console.log('📦 Full AI Response received, length:', fullResponse.length)

            const hasCode = fullResponse.includes('```html')

            // ✅ Final update with complete code
            if (isDesign && hasCode) {
                const finalCode = extractHtmlCode(fullResponse)
                if (finalCode) {
                    console.log('✅ Setting final code, length:', finalCode.length)
                    setGeneratedCode(finalCode)
                    streamingCodeRef.current = finalCode
                    await SaveGeneratedCode(finalCode)
                }
            }

            const assistantMessage = {
                role: 'assistant',
                content: hasCode ? "✨ Your website is ready! Check the preview →" : fullResponse
            }

            setMessages((prev) => [...prev, assistantMessage])
            console.log('💬 Message added to chat')

        } catch (error) {
            console.error('❌ Error in SendMessage:', error)
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, there was an error generating the response.' }
            ])
        } finally {
            setLoading(false)
            streamingCodeRef.current = ''
        }
    }

    useEffect(() => {
        if (messages.length > 0 && frameId && !isInitialLoad.current && !isSavingMessages.current) {
            SaveMessages()
        }
    }, [messages])

    const SaveMessages = async () => {
        if (isSavingMessages.current) return
        isSavingMessages.current = true
        
        console.log('💾 Saving messages:', messages.length, 'messages')
        try {
            await axios.put('/api/chats', {
                messages: messages,
                frameId: frameId
            })
            console.log('✅ Messages saved successfully')
        } catch (error) {
            console.error('❌ Error saving messages:', error)
        } finally {
            isSavingMessages.current = false
        }
    }

    const SaveGeneratedCode = async (code) => {
        if (!code || !frameId || !projectId) {
            console.log('⚠️ Missing required data for saving code')
            return
        }
        
        try {
            await axios.put('/api/frames', {
                frameId: frameId,
                designCode: code,
                projectId: projectId
            })
            console.log('✅ Design code saved successfully')
        } catch (error) {
            console.error('❌ Error saving design code:', error)
        }
    }

    console.log('🎨 Rendering with generatedCode length:', generatedCode.length)

    return ( 
        <div className="w-full h-screen flex flex-col">
            <PlaygroundHeader />

            <div className="flex w-full flex-1 overflow-hidden">
                {/* Chat Section - 38% width */}
                <div className="w-[31%] min-w-0 border-r border-gray-200">
                    <ChatSection
                        messages={messages}
                        onSend={SendMessage}
                        loading={loading}
                    />
                </div>

                {/* Website Design - 62% width */}
                <div className="w-[82%] min-w-0">
                    <WebsiteDesign generatedCode={generatedCode} isBuilding={loading} />
                </div>
            </div>
        </div>
    )
}

export default PlaygroundPage