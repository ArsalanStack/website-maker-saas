import { NextResponse } from 'next/server';
import { db } from '../../../lib/db'
import { chatTable, frameTable, projectTable } from '../../../Schema/schema'
import { and, eq } from 'drizzle-orm';


export async function GET(req){
    const {searchParams} = new URL(req.url);
    const frameId = searchParams.get('frameId')
    const projectId = searchParams.get('projectId')

    const frameResult = await db.select().from(frameTable).where(eq(frameTable.frameId, frameId))

    const chatResult = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId))

    const finalResult = {
        ...frameResult[0],
        chatMessages:chatResult[0].chatMessage
    }

    return NextResponse.json(finalResult)
}


export async function PUT(req){
    const {designCode, frameId, projectId} = await req.json();

    const result = await db.update(frameTable).set({
        designCode: designCode
    }).where(and(eq(frameTable.frameId, frameId),eq(frameTable.projectId, projectId)));

    return NextResponse.json({result: 'success'})
}