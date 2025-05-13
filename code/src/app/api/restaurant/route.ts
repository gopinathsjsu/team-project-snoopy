import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { QueryResult } from "mysql2";
import { verifyToken } from "@/app/api/auth2/funcs";
import { ScheduleRow, ApiResponse, cleanRow } from "@/utils/types";

// /api/restaurant
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "approved";
    const [rows] = await pool.query(
      `
        SELECT 
          *
        FROM restaurants
        WHERE status = ?
        ORDER BY name ASC
      `,
      [status]
    );
    const schedules = rows as ScheduleRow[];
    for (const row of schedules) {
      cleanRow(row);
    }
    return NextResponse.json(schedules);
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
    const {
      name,
      address,
      contact,
      cuisine,
      hours,
      availableTimes,
      tableSize,
      description,
      photos,
      website,
      phone,
      menu,
      token,
    } = await req.json();
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

    if (!name) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Restaurant name are required",
        },
        { status: 400 }
      );
    }

    // Insert new user
    const user_id = user.user_id;
    const dt = new Date();
    const createdAt = dt.toISOString();
    // Insert new restaurant
    const [result] = await pool.query(
      `INSERT INTO restaurants (
        name,
        user_id,
        address,
        contact,
        cuisine,
        hours,
        availableTimes,
        tableSize,
        lat,
        lng,
        description,
        photos,
        status,
        createdAt,
        updateAt,
        phone,
        website,
        menu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        user_id,
        JSON.stringify(address),
        contact,
        cuisine,
        JSON.stringify(hours),
        JSON.stringify(availableTimes),
        JSON.stringify(tableSize),
        address.lat,
        address.lng,
        description,
        JSON.stringify(photos),
        "pending", // New restaurants are not approved by default
        createdAt,
        createdAt,
        phone,
        website,
        JSON.stringify(menu),
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
    const {
      name,
      address,
      contact,
      cuisine,
      hours,
      availableTimes,
      tableSize,
      description,
      photos,
      website,
      phone,
      menu,
      id,
      token,
    } = await req.json();
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

    if (!name) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Restaurant name are required",
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
        name = ?,
        address = ?,
        contact = ?,
        cuisine = ?,
        hours = ?,
        availableTimes = ?,
        tableSize = ?,
        lat = ?,
        lng = ?,
        description = ?,
        photos = ?,
        updateAt = ?,
        phone = ?,
        website = ?,
        menu = ?
        WHERE id = ?
      `,
      [
        name,
        JSON.stringify(address),
        contact,
        cuisine,
        JSON.stringify(hours),
        JSON.stringify(availableTimes),
        JSON.stringify(tableSize),
        address.lat,
        address.lng,
        description,
        JSON.stringify(photos),
        createdAt,
        phone,
        website,
        JSON.stringify(menu),
        id,
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
