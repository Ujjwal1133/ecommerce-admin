import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET() {
  await connectDB();

  const existing = await Admin.findOne({ username: "admin" });
  if (existing) {
    return NextResponse.json({ message: "Admin already exists" });
  }

  await Admin.create({
    username: "admin",
    password: "admin123",
  });

  return NextResponse.json({
    message: "Default admin created",
    credentials: {
      username: "admin",
      password: "admin123",
    },
  });
}
