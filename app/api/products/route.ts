import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

/* ================= GET PRODUCTS ================= */
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* ================= CREATE PRODUCT ================= */
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const file = formData.get("image") as File | null;

    if (!name || isNaN(price) || isNaN(stock)) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    let image = "";
    let imagePublicId = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      image = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const product = await Product.create({
      name,
      price,
      stock,
      image,
      imagePublicId,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

/* ================= UPDATE PRODUCT ================= */
export async function PUT(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const file = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID missing" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    /* ✅ FIX: ALWAYS DELETE OLD IMAGE SAFELY */
    if (file && file.size > 0) {
      if (product.imagePublicId && product.imagePublicId.trim() !== "") {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      product.image = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    if (name) product.name = name;
    if (!isNaN(price)) product.price = price;
    if (!isNaN(stock)) product.stock = stock;

    await product.save();

    return NextResponse.json(product);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ================= DELETE PRODUCT ================= */
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    /* ✅ FIX: GUARANTEED CLOUDINARY CLEANUP */
    if (product.imagePublicId && product.imagePublicId.trim() !== "") {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
