import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = path.extname(file.name);
    const newFileName = `file_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, newFileName);

    await writeFile(filePath, buffer);

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        filePath: filePath,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
