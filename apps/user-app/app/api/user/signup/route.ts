import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { phone, password, name } = await req.json();
    if (!phone || !password || !name) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const existingUser = await prisma.user.findFirst({ where: { number: phone } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        number: phone,
        password: hashedPassword,
        name,
      },
    });
    return NextResponse.json({ message: "User created", user: { id: user.id, phone: user.number, name: user.name } });
  } catch (e) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
