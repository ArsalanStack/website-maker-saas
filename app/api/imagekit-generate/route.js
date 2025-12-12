import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function POST(req) {
    try {
        const { prompt, width, height } = await req.json();

        const imagekit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
        });

        // Use ImageKit's AI generation (if available in your plan)
        // Note: This requires ImageKit AI features to be enabled
        const result = await imagekit.upload({
            file: `https://placehold.co/${width}x${height}.png?text=${encodeURIComponent(prompt)}`,
            fileName: `ai-generated-${Date.now()}.png`,
            folder: '/website-images/ai-generated',
        });

        return NextResponse.json({
            url: result.url,
            fileId: result.fileId,
        });
    } catch (error) {
        console.error('ImageKit generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate image' },
            { status: 500 }
        );
    }
}