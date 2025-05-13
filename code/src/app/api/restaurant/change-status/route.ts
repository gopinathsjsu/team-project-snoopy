import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/app/api/auth2/funcs";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// /api/restaurant/change-status?status=approved&id=1&token=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!status || !id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Status/id is missing.",
        },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Token is missing.",
        },
        { status: 400 }
      );
    }
    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "User info is missing.",
        },
        { status: 400 }
      );
    }
    const [rows] = await pool.query(
      `
        UPDATE restaurants SET status = ?
        WHERE id = ?
      `,
      [status, id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
