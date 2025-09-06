import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getAdventureById } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const adventure = await getAdventureById(id);

    if (!adventure) {
      return NextResponse.json({ error: "Adventure not found" }, { status: 404 });
    }

    // Verify the user owns this adventure
    if (adventure.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(adventure);
  } catch (error) {
    console.error("Error fetching adventure:", error);
    return NextResponse.json(
      { error: "Failed to fetch adventure" },
      { status: 500 }
    );
  }
}
