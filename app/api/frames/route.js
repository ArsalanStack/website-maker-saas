import { NextResponse } from 'next/server';
import { db } from '../../../lib/db'
import { chatTable, frameTable, projectTable } from '../../../Schema/schema'
import { and, eq } from 'drizzle-orm';


export async function GET(req){
    try {
        const {searchParams} = new URL(req.url);
        const frameId = searchParams.get('frameId')
        const projectId = searchParams.get('projectId')

        if (!frameId || !projectId) {
            return NextResponse.json({ error: 'Missing frameId or projectId' }, { status: 400 })
        }

        const frameResult = await db.select().from(frameTable).where(eq(frameTable.frameId, frameId))

        if (!frameResult || frameResult.length === 0) {
            return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
        }

        const chatResult = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId))

        const finalResult = {
            ...frameResult[0],
            chatMessages: chatResult.length > 0 ? chatResult[0].chatMessage : []
        }

        return NextResponse.json(finalResult)
    } catch (error) {
        console.error('❌ Error in GET /api/frames:', error)
        return NextResponse.json({ error: 'Failed to fetch frame details', details: error.message }, { status: 500 })
    }
}


export async function PUT(req){
    try {
        const {designCode, frameId, projectId} = await req.json();

        if (!designCode || !frameId || !projectId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const result = await db.update(frameTable).set({
            designCode: designCode
        }).where(and(eq(frameTable.frameId, frameId), eq(frameTable.projectId, projectId)));

        return NextResponse.json({result: 'success', updated: result})
    } catch (error) {
        console.error('❌ Error in PUT /api/frames:', error)
        return NextResponse.json({ error: 'Failed to save frame', details: error.message }, { status: 500 })
    }
}