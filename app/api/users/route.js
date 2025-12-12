import { currentUser } from "@clerk/nextjs/server";
import { db } from '../../../lib/db'
import { usersTable } from '../../../Schema/schema'
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const user = await currentUser()

    if (!user) {
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
}


    const userResult = await db.select().from(usersTable).where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress))


    if(userResult?.length == 0){
        const result = await db.insert(usersTable).values({
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
        })
        return NextResponse({user: result})
    }

    return NextResponse.json({user})
}