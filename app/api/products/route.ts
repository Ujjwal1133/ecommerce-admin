import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    console.log("👉 CONNECTING TO DB...");
    await connectDB();
    console.log("✅ DB CONNECTED");

    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
