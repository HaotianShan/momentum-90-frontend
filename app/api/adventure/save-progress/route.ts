import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { saveAdventureProgress } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, quests, completedQuests, totalXP } = await request.json();

    // Verify the user is updating their own data
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await saveAdventureProgress(userId, quests, completedQuests, totalXP);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error saving adventure progress:", error);
    return NextResponse.json(
      { error: "Failed to save adventure progress" },
      { status: 500 }
    );
  }
}
