import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { QueryResult } from "mysql2";
import { verifyToken } from "@/app/api/auth2/funcs";
import { ApiResponse } from "@/utils/types";
import { mail } from "@/utils/funcs";

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
        WHERE b.uid = ? and b.status = 1
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
    const { id, partySize, reserveDay, reserveTime, token, name } =
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
    await mail({
      email: user.email,
      name: user.name,
      subject: `Booking Confirmation - ${name}`,
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #2c3e50;">Thank you for your reservation at <span style="color: #e67e22;">${name}</span>!</h2>
          <p style="font-size: 16px; color: #555;">Here are your booking details:</p>
          <table style="width: 100%; font-size: 15px; color: #333; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0;">${reserveDay}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Time:</td>
              <td style="padding: 8px 0;">${reserveTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Party Size:</td>
              <td style="padding: 8px 0;">${partySize}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 14px; color: #888;">
            You’ll receive updates if your reservation status changes. We look forward to seeing you!
          </p>
        </div>
      `,
    });

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
      `UPDATE booking SET
        status = ?,
        partySize = ?,
        reserveDay = ?,
        reserveTime = ?,
        updatedAt = ?
        where booking_id = ?
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
