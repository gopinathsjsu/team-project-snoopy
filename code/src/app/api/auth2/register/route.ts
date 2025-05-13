import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";
import { QueryResult } from "mysql2";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// /api/auth2/register
export async function POST(req: NextRequest) {
  try {
    const { email, password, username, name } = await req.json();

    if (!email || !password || !username || !name) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Email, password, username, name are required",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    console.log("existingUsers: ", existingUsers);
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Email or username already registered",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const dt = new Date();
    const createdAt = dt.toISOString();
    const role = "customer";
    const [result] = await pool.execute(
      "INSERT INTO users (email, password, username, name, createdAt, role) VALUES (?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, username, name, createdAt, role]
    );

    return NextResponse.json<ApiResponse<QueryResult>>(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
