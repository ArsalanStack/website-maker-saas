'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { SendHorizonalIcon, ImagePlus, Key, Brush, LayoutTemplate, Flashlight, Loader2Icon } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'



const suggestions = [
  {
    "label": "Instant Website",
    "prompt": "Generate a fully responsive website in seconds using AI-driven prompts.",
    "icon": Flashlight
  },
  {
    "label": "Custom Templates",
    "prompt": "Choose from curated templates tailored to your business or personal needs.",
    "icon": LayoutTemplate
  },
  {
    "label": "Edit Visually",
    "prompt": "Tweak your content, layout, and design with a no-code visual editor.",
    "icon": Brush
  },
  {
    "label": "SEO Optimized",
    "prompt": "Websites are built with clean code and SEO best practices out of the box.",
    "icon": Key
  }
]


const Hero = () => {

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  function fourDigit() {
    return Math.floor(1000 + Math.random() * 9000)
  }


  const [userInput, setUserInput] = useState()

  const createNewProject = async () => {

    const messages = [{
      role: 'user',
      content: userInput
    }]

    const projectId = uuidv4();
    const frameId = fourDigit()

    try {
      setLoading(true)
      await axios.post('/api/projects', {
        projectId: projectId,
        frameId: frameId,
        messages: messages
      })

      toast.success('Project Created!')
      router.push(`/playground/${projectId}?frameId=${frameId}`)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Internal Server error')
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      <h2 className='text-6xl font-bold'>What should we design?</h2>
      <h2 className='mt-2 text-xl text-gray-500'>Generate, edit and explore designs with Ai, Export to Code.</h2>

      <div className="w-full mt-8  max-w-2xl p-5 border rounded-2xl">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className='focus:outline-none resize-none w-full h-24 focus:ring-0 ' placeholder='Describe your page design' />
        <div className="flex items-center justify-between">
          <Button variant={'ghost'}><ImagePlus /></Button>
          <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
            <Button onClick={createNewProject} disabled={!userInput || loading}>
              {loading ? <Loader2Icon className='animate-spin' /> : <SendHorizonalIcon />}
            </Button>
          </SignInButton>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            onClick={() => setUserInput(suggestion.prompt)}
            key={index} variant={'outline'}>
            <suggestion.icon />
            {suggestion.label}</Button>
        ))}
      </div>
    </div>
  )
}

export default Hero