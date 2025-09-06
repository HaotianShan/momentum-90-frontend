import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, asc, desc, eq, gt, gte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  user,
  userPlans,
  type User,
  type UserPlans,
} from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}


export async function createUser(email: string, password: string | null) {
  let hash = null;
  if (password) {
    const salt = genSaltSync(10);
    hash = hashSync(password, salt);
  }
  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function getUserPlan(userId: string): Promise<UserPlans | null> {
  try {
    const plans = await db.select().from(userPlans).where(eq(userPlans.userId, userId));
    return plans.length > 0 ? plans[0] : null;
  } catch (error) {
    console.error("Failed to get user plan from database");
    throw error;
  }
}

export async function createUserPlan(userId: string, superGoal: string): Promise<UserPlans> {
  try {
    const result = await db.insert(userPlans).values({ 
      userId: userId, 
      superGoal: superGoal
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to create user plan in database");
    throw error;
  }
}

export async function updateUserPlan(userId: string, superGoal: string): Promise<UserPlans> {
  try {
    const result = await db
      .update(userPlans)
      .set({ superGoal })
      .where(eq(userPlans.userId, userId))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update user plan in database");
    throw error;
  }
}

export async function getAllUserPlans(): Promise<UserPlans[]> {
  try {
    return await db.select().from(userPlans).orderBy(desc(userPlans.createdAt));
  } catch (error) {
    console.error("Failed to get all user plans from database");
    throw error;
  }
}

export async function saveAdventureProgress(
  adventureId: string,
  userId: string, 
  quests: any[], 
  completedQuests: number[], 
  totalXP: number
): Promise<UserPlans> {
  try {
    const result = await db
      .update(userPlans)
      .set({ 
        quests: quests,
        completedQuests: completedQuests,
        totalXP: totalXP
      })
      .where(and(eq(userPlans.id, adventureId), eq(userPlans.userId, userId)))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to save adventure progress to database");
    throw error;
  }
}

export async function getUserAdventures(userId: string): Promise<UserPlans[]> {
  try {
    return await db
      .select()
      .from(userPlans)
      .where(eq(userPlans.userId, userId))
      .orderBy(desc(userPlans.createdAt));
  } catch (error) {
    console.error("Failed to get user adventures from database");
    throw error;
  }
}

export async function getAdventureById(adventureId: string): Promise<UserPlans | null> {
  try {
    const result = await db
      .select()
      .from(userPlans)
      .where(eq(userPlans.id, adventureId));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get adventure by ID from database");
    throw error;
  }
}