'use client'
import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Code, Download, Monitor, SquareArrowOutUpRight, TabletSmartphone } from 'lucide-react'
import { toast } from 'sonner'
import CodeViewDialog from './CodeViewDialog'

function WebPageTool({ selectedScreenSize, setSelectedScreenSize, generatedCode }) {
  const [showCodeDialog, setShowCodeDialog] = useState(false)

  // View in new tab
  const viewInNewTab = () => {
    if (!generatedCode) {
      toast.error('No code generated yet!')
      return
    }

    const fullHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Generated Website</title>

  <!-- Tailwind (CDN) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Flowbite (CSS + JS) -->
  <link href="https://unpkg.com/flowbite@1.6.6/dist/flowbite.min.css" rel="stylesheet" />
  <script src="https://unpkg.com/flowbite@1.6.6/dist/flowbite.min.js"></script>

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- AOS (Animate On Scroll) -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>

  <!-- Lottie (lottie-web) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js"></script>

  <!-- Swiper -->
  <link rel="stylesheet" href="https://unpkg.com/swiper@8/swiper-bundle.min.css" />
  <script src="https://unpkg.com/swiper@8/swiper-bundle.min.js"></script>

  <!-- Popper (required by Tippy) + Tippy.js -->
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
  <script src="https://unpkg.com/tippy.js@6"></script>

  <style>
    body { 
      background: linear-gradient(180deg, #f8fafc, #ffffff);
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
${generatedCode}

<script>
  // Initialize AOS if present
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Initialize Tippy if present
  if (typeof tippy !== 'undefined') {
    tippy('[data-tippy-content]', {
      placement: 'top',
      animation: 'fade',
    });
  }

  // Initialize Flowbite components
  if (typeof Flowbite !== 'undefined') {
    Flowbite.init();
  }
</script>
</body>
</html>`

    const blob = new Blob([fullHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    toast.success('Opened in new tab!')
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  // Download HTML file
  const downloadHTML = () => {
    if (!generatedCode) {
      toast.error('No code generated yet!')
      return
    }

    const fullHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Generated Website</title>

  <!-- Tailwind (CDN) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Flowbite (CSS + JS) -->
  <link href="https://unpkg.com/flowbite@1.6.6/dist/flowbite.min.css" rel="stylesheet" />
  <script src="https://unpkg.com/flowbite@1.6.6/dist/flowbite.min.js"></script>

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- AOS (Animate On Scroll) -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>

  <!-- Lottie (lottie-web) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js"></script>

  <!-- Swiper -->
  <link rel="stylesheet" href="https://unpkg.com/swiper@8/swiper-bundle.min.css" />
  <script src="https://unpkg.com/swiper@8/swiper-bundle.min.js"></script>

  <!-- Popper (required by Tippy) + Tippy.js -->
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
  <script src="https://unpkg.com/tippy.js@6"></script>

  <style>
    body { 
      background: linear-gradient(180deg, #f8fafc, #ffffff);
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
${generatedCode}

<script>
  // Initialize AOS if present
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Initialize Tippy if present
  if (typeof tippy !== 'undefined') {
    tippy('[data-tippy-content]', {
      placement: 'top',
      animation: 'fade',
    });
  }

  // Initialize Flowbite components
  if (typeof Flowbite !== 'undefined') {
    Flowbite.init();
  }
</script>
</body>
</html>`

    const blob = new Blob([fullHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'index.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Downloaded index.html successfully!')
  }

  // View code
  const viewCode = () => {
    if (!generatedCode) {
      toast.error('No code generated yet!')
      return
    }
    setShowCodeDialog(true)
  }

  return (
    <>
      <div className='p-3 shadow-lg bg-white rounded-xl w-full flex items-center justify-between border'>
        <div className="flex gap-2">
          <Button 
            className={`${selectedScreenSize === 'web' ? 'bg-blue-50 border-2 border-blue-500 text-blue-600' : ''} transition-all`} 
            variant={'ghost'} 
            onClick={() => setSelectedScreenSize('web')}
            size="sm"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button 
            className={`${selectedScreenSize === 'mobile' ? 'bg-blue-50 border-2 border-blue-500 text-blue-600' : ''} transition-all`} 
            variant={'ghost'}  
            onClick={() => setSelectedScreenSize('mobile')}
            size="sm"
          >
            <TabletSmartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant={'outline'} onClick={viewInNewTab} size="sm">
            <SquareArrowOutUpRight className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button variant={'outline'} onClick={viewCode} size="sm">
            <Code className="w-4 h-4 mr-2" />
            Code
          </Button>
          <Button onClick={downloadHTML} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <CodeViewDialog 
        open={showCodeDialog} 
        onOpenChange={setShowCodeDialog}
        code={generatedCode}
      />
    </>
  )
}

export default WebPageTool