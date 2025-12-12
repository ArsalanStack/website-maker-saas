import { db } from "@/lib/db";
import { chatTable } from "@/Schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req) {
    const {messages, frameId} = await req.json();

    const result = await db.update(chatTable).set({
        chatMessage: messages
    }).where(eq(chatTable.frameId, frameId));

    return NextResponse.json({result: 'Chat Updated Successfully'});
}