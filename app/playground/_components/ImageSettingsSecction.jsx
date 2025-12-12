"use client"
import React, { useRef, useState, useEffect } from "react";
import {
    Image as ImageIcon,
    Crop,
    Expand,
    ImagePlus,
    ImageMinus,
    Upload,
    Loader2,
    Check,
    Sparkles,
    X,
    AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const transformOptions = [
    { label: "Resize", value: "resize", icon: Expand },
    { label: "Dropshadow", value: "dropshadow", icon: Crop },
    { label: "Upscale", value: "upscale", icon: ImagePlus },
    { label: "BG Remove", value: "bgremove", icon: ImageMinus },
];

function getImageKitTransformedURL(originalUrl, transforms) {
    if (!originalUrl) return "";

    try {
        // Extract the base URL and path
        // Original: https://ik.imagekit.io/6gheyqz99/website-images/file.png
        // Target: https://ik.imagekit.io/6gheyqz99/tr:transforms/website-images/file.png
        
        const url = new URL(originalUrl);
        const pathParts = url.pathname.split('/').filter(p => p); // Remove empty strings
        
        if (pathParts.length === 0) return originalUrl;
        
        // First part is the imagekit ID (e.g., "6gheyqz99")
        const imagekitId = pathParts[0];
        // Rest is the file path
        const filePath = '/' + pathParts.slice(1).join('/');
        
        const transformString = transforms.join(",");
        
        // Build: https://ik.imagekit.io/6gheyqz99/tr:transforms/website-images/file.png
        return `${url.origin}/${imagekitId}/tr:${transformString}${filePath}`;
    } catch (error) {
        console.error("Error building transform URL:", error);
        return originalUrl;
    }
}

function ImageSettingsSection({ selectedEl, clearSelection }) {
    const [altText, setAltText] = useState(selectedEl?.alt || "");
    const [prompt, setPrompt] = useState(selectedEl?.alt || "");
    const [width, setWidth] = useState(selectedEl?.width || selectedEl?.naturalWidth || 512);
    const [height, setHeight] = useState(selectedEl?.height || selectedEl?.naturalHeight || 512);
    const [borderRadius, setBorderRadius] = useState(selectedEl?.style?.borderRadius || "0px");
    const [preview, setPreview] = useState(selectedEl?.src || "");
    const [originalUrl, setOriginalUrl] = useState(selectedEl?.src || "");
    const [activeTransforms, setActiveTransforms] = useState([]);

    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (selectedEl) {
            const alt = selectedEl.alt || "";
            setAltText(alt);
            setPrompt(alt);
            setWidth(selectedEl.width || selectedEl.naturalWidth || 512);
            setHeight(selectedEl.height || selectedEl.naturalHeight || 512);
            setBorderRadius(selectedEl.style?.borderRadius || "0px");
            setPreview(selectedEl.src || "");
            setOriginalUrl(selectedEl.src || "");
            setActiveTransforms([]);
        }
    }, [selectedEl]);

    const toggleTransform = (value) => {
        setActiveTransforms((prev) => {
            if (prev.includes(value)) {
                return prev.filter((t) => t !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    useEffect(() => {
        if (!originalUrl || activeTransforms.length === 0) {
            if (originalUrl && activeTransforms.length === 0) {
                setPreview(originalUrl);
                setIsTransforming(false);
            }
            return;
        }

        const applyTransformations = async () => {
            try {
                setIsTransforming(true);
                await new Promise(resolve => setTimeout(resolve, 300));

                const transformations = [];

                activeTransforms.forEach((transform) => {
                    switch (transform) {
                        case "resize":
                            transformations.push(`w-${width}`);
                            transformations.push(`h-${height}`);
                            transformations.push(`c-at_max`);
                            break;

                        case "dropshadow":
                            transformations.push(`e-shadow`);
                            break;

                        case "upscale":
                            transformations.push(`e-upscale`);
                            break;

                        case "bgremove":
                            transformations.push(`e-removedotbg`);
                            break;
                    }
                });

                console.log("Applying transformations:", transformations);

                const transformedUrl = getImageKitTransformedURL(originalUrl, transformations);
                console.log("Transformed URL:", transformedUrl);

                const img = new Image();
                img.onload = () => {
                    setPreview(transformedUrl);
                    setIsTransforming(false);
                    toast.success('Transformations applied successfully!');
                };
                img.onerror = () => {
                    console.error("Failed to load transformed image");
                    setIsTransforming(false);
                    toast.error('Failed to apply transformations');
                    setPreview(originalUrl);
                };
                img.src = transformedUrl;

            } catch (error) {
                console.error('Transformation error:', error);
                toast.error('Failed to apply transformations');
                setIsTransforming(false);
                setPreview(originalUrl);
            }
        };

        applyTransformations();
    }, [activeTransforms, width, height, originalUrl]);

    useEffect(() => {
        if (selectedEl && !isTransforming) {
            selectedEl.src = preview;
            selectedEl.alt = altText;
            selectedEl.style.borderRadius = borderRadius;
            if (activeTransforms.includes('resize')) {
                selectedEl.width = width;
                selectedEl.height = height;
            }
        }
    }, [preview, altText, borderRadius, width, height, selectedEl, activeTransforms, isTransforming]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setUploadError("Please upload an image file");
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError("File size must be less than 10MB");
            toast.error("File size must be less than 10MB");
            return;
        }

        try {
            setIsUploading(true);
            setUploadSuccess(false);
            setUploadError("");

            const authResponse = await fetch("/api/imagekit-auth");
            if (!authResponse.ok) {
                throw new Error("Failed to get authentication");
            }
            const authData = await authResponse.json();

            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", `website-${Date.now()}-${file.name}`);
            formData.append("folder", "/website-images");
            formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
            formData.append("signature", authData.signature);
            formData.append("expire", authData.expire);
            formData.append("token", authData.token);

            const uploadResponse = await fetch(
                "https://upload.imagekit.io/api/v1/files/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.message || "Upload failed");
            }

            const uploadData = await uploadResponse.json();

            setOriginalUrl(uploadData.url);
            setPreview(uploadData.url);
            setActiveTransforms([]);
            setUploadSuccess(true);
            toast.success("Image uploaded successfully!");

            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadError(error.message || "Failed to upload image");
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const generateAIImage = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt");
            return;
        }

        try {
            setIsGenerating(true);
            toast.info("Generating AI image...");

            // Clean prompt for URL - remove special characters
            const cleanPrompt = prompt.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ');
            
            // Generate unique filename to avoid caching issues
            const timestamp = Date.now();
            const filename = `ai-gen-${timestamp}.jpg`;
            
            // ImageKit AI generation URL format: /ik-genimg-prompt-{text}/path/filename.jpg
            const generatedImageUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodeURIComponent(cleanPrompt)}/ai-generated/${filename}`;

            console.log('Generated Image URL:', generatedImageUrl);

            // Wait for image to be generated
            const img = new Image();
            img.onload = () => {
                setOriginalUrl(generatedImageUrl);
                setPreview(generatedImageUrl);
                setAltText(prompt);
                setActiveTransforms([]);
                setIsGenerating(false);
                toast.success("AI image generated successfully!");
            };
            
            img.onerror = () => {
                console.error("Failed to generate image");
                setIsGenerating(false);
                toast.error("Failed to generate AI image. Please try again with a different prompt.");
            };
            
            img.src = generatedImageUrl;

        } catch (error) {
            console.error("Generation failed:", error);
            toast.error(error.message || "Failed to generate AI image");
            setIsGenerating(false);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    if (!selectedEl) {
        return (
            <div className='w-full bg-white shadow-xl rounded-lg p-6 space-y-5 border border-gray-200 overflow-y-auto max-h-[85vh]'>
                <h2 className="flex gap-2 items-center font-bold text-lg text-gray-800">
                    <ImageIcon className="w-5 h-5 text-blue-600" /> Image Settings
                </h2>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Select an image to edit its properties
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Click on any image in edit mode
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white shadow-xl rounded-lg p-6 space-y-5 border border-gray-200 overflow-y-auto max-h-[88vh]">
            <div className="flex items-center justify-between">
                <h2 className="flex gap-2 items-center font-bold text-lg text-gray-800">
                    <ImageIcon className="w-5 h-5 text-blue-600" /> Image Settings
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

            <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-mono">
                    img{selectedEl.id ? `#${selectedEl.id}` : ''}
                    {selectedEl.className ? `.${selectedEl?.className.split(' ')[0]}` : ''}
                </p>
            </div>

            <div className="relative">
                <div
                    className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all cursor-pointer group"
                    onClick={openFileDialog}
                >
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt={altText}
                                style={{ borderRadius }}
                                className="max-h-48 object-contain rounded group-hover:opacity-80 transition-opacity"
                            />
                            {isTransforming && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded">
                                    <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                                    <p className="text-white text-xs font-medium">Applying transforms...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <Upload className="w-12 h-12 mb-2" />
                            <p className="text-sm font-medium">Click to upload image</p>
                            <p className="text-xs mt-1">Max 10MB • PNG, JPG, WebP</p>
                        </div>
                    )}
                </div>

                {uploadSuccess && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg animate-fade-in">
                        <Check className="w-3 h-3" />
                        Uploaded!
                    </div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={openFileDialog}
                disabled={isUploading || isTransforming || isGenerating}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        Upload New Image
                    </>
                )}
            </Button>

            {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {uploadError}
                </div>
            )}

            <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2 text-purple-600">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="font-semibold text-sm">AI Image Generation</h3>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Image Prompt
                    </label>
                    <Input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. A beautiful sunset over mountains"
                        disabled={isGenerating || isTransforming || isUploading}
                    />
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={generateAIImage}
                    disabled={isGenerating || !prompt.trim() || isTransforming || isUploading}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate AI Image
                        </>
                    )}
                </Button>
            </div>

            <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    AI Transformations
                </label>
                <div className="grid grid-cols-4 gap-2">
                    <TooltipProvider>
                        {transformOptions.map((opt) => {
                            const isActive = activeTransforms.includes(opt.value);
                            const IconComponent = opt.icon;
                            return (
                                <div key={opt.value} className="relative group">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={isActive ? "default" : "outline"}
                                                className={`w-full h-14 flex flex-col items-center justify-center p-2 relative transition-all ${
                                                    isTransforming || isUploading || isGenerating ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                onClick={() => !isTransforming && !isUploading && !isGenerating && toggleTransform(opt.value)}
                                                disabled={isTransforming || isUploading || isGenerating}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="text-center">
                                                <div className="font-medium">{opt.label}</div>
                                                {isActive && <div className="text-xs opacity-75">(Active)</div>}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </TooltipProvider>
                </div>
                {activeTransforms.length > 0 && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-xs font-semibold text-blue-900 mb-1">
                            Active Transforms:
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {activeTransforms.map((transform, index) => (
                                <span
                                    key={transform}
                                    className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-semibold"
                                >
                                    {transformOptions.find(t => t.value === transform)?.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {activeTransforms.includes("resize") && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 animate-fade-in">
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                        <Expand className="w-4 h-4" />
                        Resize Settings
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Width (px)
                            </label>
                            <Input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                min="1"
                                max="4000"
                                disabled={isTransforming || isUploading || isGenerating}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Height (px)
                            </label>
                            <Input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                min="1"
                                max="4000"
                                disabled={isTransforming || isUploading || isGenerating}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Border Radius
                </label>
                <Input
                    type="text"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    placeholder="e.g. 8px or 50%"
                />
                <div className="flex gap-2 mt-2">
                    {["0px", "8px", "16px", "50%"].map((radius) => (
                        <button
                            key={radius}
                            onClick={() => setBorderRadius(radius)}
                            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
                        >
                            {radius}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 

export default ImageSettingsSection;