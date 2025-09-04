"use server";

import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { createUserPlan, getUserPlan } from "@/lib/db/queries";

export async function checkUserLoggedIn() {
  const session = await auth();
  return !!session?.user?.id;
}

export async function submitSuperGoal(superGoal: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    await createUserPlan(session.user.id, superGoal);
    return { success: true };
  } catch (error) {
    console.error("Failed to submit super goal:", error);
    return { success: false, error: "Failed to save super goal" };
  }
}

export async function getCurrentUserPlan() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    return await getUserPlan(session.user.id);
  } catch (error) {
    console.error("Failed to get user plan:", error);
    return null;
  }
}
