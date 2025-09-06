import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getUserAdventures } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adventures = await getUserAdventures(session.user.id);

    return NextResponse.json(adventures);
  } catch (error) {
    console.error("Error fetching user adventures:", error);
    return NextResponse.json(
      { error: "Failed to fetch user adventures" },
      { status: 500 }
    );
  }
}
