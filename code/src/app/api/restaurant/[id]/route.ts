import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { ScheduleRow } from "@/utils/types";
import { verifyToken } from "../../auth2/funcs";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const cleanRow = (row: ScheduleRow) => {
  row.menu ??= "[]";
  row.address = JSON.parse(row.address);
  row.hours = JSON.parse(row.hours);
  row.availableTimes = JSON.parse(row.availableTimes);
  row.tableSize = JSON.parse(row.tableSize);
  row.photos = JSON.parse(row.photos);
  row.menu = JSON.parse(row.menu);

  row.phone ??= "";
  row.website ??= "";
  return row;
};
// /api/restaurant/4
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const { id } = await params;
    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Id is missing.",
        },
        { status: 400 }
      );
    }
    const [rows] = await pool.query(
      `
        SELECT 
          *
        FROM restaurants
        WHERE id = ? 
        ORDER BY name ASC
      `,
      [id]
    );
    const schedules = rows as ScheduleRow[];
    let row = null;
    for (row of schedules) {
      cleanRow(row);
      break;
    }
    if (token) {
      const user = verifyToken(token);
      if (user) {
        const [rows2] = await pool.query(
          `
          SELECT 
            *
          FROM booking
          WHERE id = ? 
          AND uid = ?
          ORDER BY booking_id DESC
        `,
          [parseInt(id, 10), user?.user_id]
        );
        if (row) {
          row.bookings = rows2 as any[];
        }
      }
    }

    return NextResponse.json(row);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
