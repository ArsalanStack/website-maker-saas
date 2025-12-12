import { currentUser } from '@clerk/nextjs/server'
import { db } from '../../../lib/db'
import { chatTable, frameTable, projectTable } from '../../../Schema/schema'
import { NextResponse } from 'next/server'


export async function POST(req) {
   try {
     const {projectId, frameId, messages} = await req.json()
    const user = await currentUser()

    const projectResult = await db.insert(projectTable).values({
        projectId: projectId,
        createdBy: user.primaryEmailAddress.emailAddress
    })

    const frameResult = await db.insert(frameTable).values({
        projectId: projectId,
        frameId: frameId
    })


    const chatResult = await db.insert(chatTable).values({
        chatMessage: messages,
        createdBy: user.primaryEmailAddress.emailAddress,
        frameId: frameId
    })

    return NextResponse.json({ projectId, frameId, messages })
   } catch (error) {
    return NextResponse.json({error})
   }
}