import { NextResponse, type NextRequest } from "next/server";
import { handleError } from "@/utils/funcs";
import { writeFile } from "fs/promises";
import { ensureDir } from "@/lib/CacheDb";

// /api/uploads
export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: any = data.get("file");
    const user = data.get("user");

    if (!file) {
      return NextResponse.json({ success: 0, error: "No Image Found." });
    }

    await ensureDir(`./files/uploads/${user}`);
    const dt = new Date();
    const prefix =
      dt.getFullYear() +
      "-" +
      (dt.getMonth() + 1) +
      "-" +
      dt.getDate() +
      "_" +
      dt.getHours() +
      "-" +
      dt.getMinutes() +
      "-" +
      dt.getSeconds();

    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./files/uploads/${user}/${prefix}-${file.name}`;
    await writeFile(path, buffer);

    return NextResponse.json({
      success: 1,
      message: "File Uploaded",
      path,
    });
  } catch (err: any) {
    const mes = await handleError(err);
    return NextResponse.json({ error: mes });
  }
}
