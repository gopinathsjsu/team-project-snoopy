import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";
import { generateToken } from "../funcs";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 }
      );
    }

    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [username, username]
    );

    const user = (users as any[])[0];

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const obj = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };

    const token = generateToken(obj);

    return NextResponse.json<ApiResponse<{ token: string; userInfo: any }>>({
      success: true,
      data: { token, userInfo: obj },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
