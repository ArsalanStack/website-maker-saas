'use client'
import { SwatchBook, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from '@/components/ui/button'

function SettingsSection({ selectedEl, clearSelection }) {
    const [classes, setClasses] = useState([])
    const [newClass, setNewClass] = useState("")
    const [align, setAlign] = useState(selectedEl?.style?.textAlign || "left")

    const applyStyle = (property, value) => {
        if (selectedEl) {
            selectedEl.style[property] = value
        }
    }

    // Update alignment style when toggled
    useEffect(() => {
        if (selectedEl && align) {
            selectedEl.style.textAlign = align
        }
    }, [align, selectedEl])

    // Keep in sync if element classes are modified elsewhere
    useEffect(() => {
        if (!selectedEl) return

        // Set initial classes
        const currentClasses = selectedEl.className
            .split(" ")
            .filter((c) => c.trim() !== "")
        setClasses(currentClasses)

        // Watch for future class changes
        const observer = new MutationObserver(() => {
            const updated = selectedEl.className
                .split(" ")
                .filter((c) => c.trim() !== "")
            setClasses(updated)
        })

        observer.observe(selectedEl, { 
            attributes: true, 
            attributeFilter: ["class"] 
        })
        
        return () => observer.disconnect()
    }, [selectedEl])

    // Remove a class
    const removeClass = (cls) => {
        const updated = classes.filter((c) => c !== cls)
        setClasses(updated)
        if (selectedEl) {
            selectedEl.className = updated.join(" ")
        }
    }

    // Add new class
    const addClass = () => {
        const trimmed = newClass.trim()
        if (!trimmed) return
        if (!classes.includes(trimmed)) {
            const updated = [...classes, trimmed]
            setClasses(updated)
            if (selectedEl) {
                selectedEl.className = updated.join(" ")
            }
        }
        setNewClass("")
    }

    // Handle Enter key in class input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addClass()
        }
    }

    if (!selectedEl) {
        return ( 
            <div className='w-[80vw] shadow p-4 space-y-4  overflow-auto h-[105vh] rounded-xl  bg-white'>
                <h2 className='flex gap-2 items-center font-bold text-gray-800'>
                    <SwatchBook /> Settings
                </h2>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <SwatchBook className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Select an element to edit its properties
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Enable Edit Mode and click on any element
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='w-96 shadow p-4 space-y-4 overflow-auto h-[88vh] rounded-xl  bg-white border'>
            <div className="flex items-center justify-between">
                <h2 className='flex gap-2 items-center font-bold text-gray-800'>
                    <SwatchBook /> Settings
                </h2>
                {clearSelection && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearSelection}
                        className="text-xs"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Selected Element Info */}
            <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-mono">
                    {selectedEl.tagName.toLowerCase()}
                    {selectedEl.id ? `#${selectedEl.id}` : ''}
                </p>
            </div>

            {/* Font Size + Text Color inline */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className='text-sm font-medium mb-1 block'>Font Size</label>
                    <Select 
                        defaultValue={selectedEl?.style?.fontSize || '16px'}
                        onValueChange={(value) => applyStyle('fontSize', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(53)].map((_, index) => (
                                <SelectItem value={index + 12 + 'px'} key={index}>
                                    {index + 12}px
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className='text-sm font-medium block mb-1'>Text Color</label>
                    <input 
                        type='color'
                        className='w-[50px] h-[40px] rounded-lg border cursor-pointer'
                        defaultValue={selectedEl?.style?.color || '#000000'}
                        onChange={(event) => applyStyle('color', event.target.value)}
                    />
                </div>
            </div>

            {/* Text Alignment */}
            <div>
                <label className="text-sm font-medium mb-2 block">Text Alignment</label>
                <ToggleGroup
                    type="single"
                    value={align}
                    onValueChange={setAlign}
                    className="bg-gray-100 rounded-lg p-1 inline-flex w-full justify-between"
                >
                    <ToggleGroupItem 
                        value="left" 
                        className="p-2 rounded hover:bg-white flex-1 data-[state=on]:bg-white data-[state=on]:shadow-sm"
                    >
                        <AlignLeft size={20} />
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                        value="center" 
                        className="p-2 rounded hover:bg-white flex-1 data-[state=on]:bg-white data-[state=on]:shadow-sm"
                    >
                        <AlignCenter size={20} />
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                        value="right" 
                        className="p-2 rounded hover:bg-white flex-1 data-[state=on]:bg-white data-[state=on]:shadow-sm"
                    >
                        <AlignRight size={20} />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Background Color + Border Radius inline */}
            <div className="flex items-center gap-4">
                <div>
                    <label className='text-sm font-medium block mb-1'>Background</label>
                    <input 
                        type='color'
                        className='w-[50px] h-[40px] rounded-lg border cursor-pointer'
                        defaultValue={selectedEl?.style?.backgroundColor || '#ffffff'}
                        onChange={(event) => applyStyle('backgroundColor', event.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label className='text-sm font-medium block mb-1'>Border Radius</label>
                    <Input 
                        type='text'
                        placeholder='e.g. 8px'
                        defaultValue={selectedEl?.style?.borderRadius || ''}
                        onChange={(e) => applyStyle('borderRadius', e.target.value)}
                    />
                </div>
            </div>

            {/* Padding */}
            <div>
                <label className='text-sm font-medium block mb-1'>Padding</label>
                <Input 
                    type='text'
                    placeholder='e.g. 10px 15px'
                    defaultValue={selectedEl?.style?.padding || ''}
                    onChange={(e) => applyStyle('padding', e.target.value)}
                />
            </div>

            {/* Margin */}
            <div>
                <label className='text-sm font-medium block mb-1'>Margin</label>
                <Input 
                    type='text'
                    placeholder='e.g. 10px 15px'
                    defaultValue={selectedEl?.style?.margin || ''}
                    onChange={(e) => applyStyle('margin', e.target.value)}
                />
            </div>

            {/* Width & Height */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className='text-sm font-medium block mb-1'>Width</label>
                    <Input 
                        type='text'
                        placeholder='e.g. 100px'
                        defaultValue={selectedEl?.style?.width || ''}
                        onChange={(e) => applyStyle('width', e.target.value)}
                    />
                </div>
                <div>
                    <label className='text-sm font-medium block mb-1'>Height</label>
                    <Input 
                        type='text'
                        placeholder='e.g. 100px'
                        defaultValue={selectedEl?.style?.height || ''}
                        onChange={(e) => applyStyle('height', e.target.value)}
                    />
                </div>
            </div>

            {/* Class Manager */}
            <div>
                <label className="text-sm font-medium block mb-2">CSS Classes</label>

                {/* Existing classes as removable chips */}
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-lg bg-gray-50">
                    {classes.length > 0 ? (
                        classes.map((cls) => (
                            <span
                                key={cls}
                                className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 border border-blue-200"
                            >
                                {cls}
                                <button
                                    onClick={() => removeClass(cls)}
                                    className="ml-1 text-blue-600 hover:text-red-600 font-bold"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs">No classes applied</span>
                    )}
                </div>

                {/* Add new class input */}
                <div className="flex gap-2 mt-3">
                    <Input
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add class name..."
                        className="flex-1"
                    />
                    <Button type="button" onClick={addClass} size="sm">
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SettingsSection