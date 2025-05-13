import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { QueryResult } from "mysql2";
import { verifyToken } from "@/app/api/auth2/funcs";
import { ApiResponse } from "@/utils/types";

// /api/restaurant/booking?token=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    let user = null;
    if (token) {
      user = verifyToken(token);
      if (!user) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: "User info is missing.",
          },
          { status: 400 }
        );
      }
    }
    const [rows] = await pool.query(
      `
        SELECT 
          *
        FROM booking as b
        INNER JOIN restaurants as r ON b.id = r.id
        WHERE b.uid = ?
        ORDER BY b.booking_id DESC
      `,
      [user?.user_id]
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

// /api/restaurant
export async function POST(req: NextRequest) {
  try {
    const { id, partySize, reserveDay, reserveTime, token } = await req.json();
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
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "User info is missing.",
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Restaurant ID is required",
        },
        { status: 400 }
      );
    }

    if (!partySize || !reserveDay || !reserveTime) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Party Size, reserve day and time are required",
        },
        { status: 400 }
      );
    }

    // Insert new user
    const user_id = user.user_id;
    const status = 1;
    const dt = new Date();
    const createdAt = dt.toISOString();
    // Insert new booking
    const [result] = await pool.query(
      `INSERT INTO booking (
        id,
        uid,
        createdAt,
        updatedAt,
        status,
        partySize,
        reserveDay,
        reserveTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        user_id,
        createdAt,
        createdAt,
        status,
        partySize,
        reserveDay,
        reserveTime,
      ]
    );

    return NextResponse.json<ApiResponse<QueryResult>>(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Restaurant error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// /api/restaurant
export async function PUT(req: NextRequest) {
  try {
    const { partySize, reserveDay, reserveTime, token, booking_id, status } =
      await req.json();
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
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "User info is missing.",
        },
        { status: 400 }
      );
    }

    if (!booking_id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Booking ID is required",
        },
        { status: 400 }
      );
    }

    if (!partySize || !reserveDay || !reserveTime) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Party Size, reserve day and time are required",
        },
        { status: 400 }
      );
    }

    // Insert new user
    const dt = new Date();
    const createdAt = dt.toISOString();
    // Insert new restaurant
    const [result] = await pool.query(
      `UPDATE restaurants SET
        status = ?,
        partySize = ?,
        reserveDay = ?,
        reserveTime = ?,
        updateAt = ?,
      `,
      [status, partySize, reserveDay, reserveTime, createdAt, booking_id]
    );

    return NextResponse.json<ApiResponse<QueryResult>>(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Restaurant error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
