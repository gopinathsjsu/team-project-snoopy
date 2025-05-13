import { NextResponse, type NextRequest } from "next/server";
import { mail, handleError } from "@/utils/funcs";

// /api/mail
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const info: any = await mail(data);

    return NextResponse.json({ info: info?.messageId, data, success: 1 });
  } catch (err: unknown) {
    const mes = await handleError(err);
    return NextResponse.json({ error: mes, success: 0 });
  }
}
