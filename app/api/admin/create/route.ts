import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin"; 
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    if (!cookies.includes("admin=true")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
