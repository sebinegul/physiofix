import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth, hashPassword } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (auth.role === "admin") {
      // Admin sees all patients
      const patients = await prisma.patient.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              createdAt: true,
            },
          },
          consultations: true,
          assignedExercises: {
            include: { exercise: true },
          },
        },
      });
      return NextResponse.json({ data: patients });
    } else {
      // Patient sees own profile
      const patient = await prisma.patient.findUnique({
        where: { userId: auth.userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              createdAt: true,
            },
          },
          consultations: true,
          assignedExercises: {
            include: { exercise: true },
          },
        },
      });

      if (!patient) {
        return NextResponse.json(
          { error: "Patient profile not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: [patient] });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Get patients error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { email, password, name, phone, dateOfBirth, gender, address, emergencyContact, medicalHistory, allergies } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user and patient in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "patient",
          phone: phone || null,
        },
      });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: dateOfBirth || null,
          gender: gender || null,
          address: address || null,
          emergencyContact: emergencyContact || null,
          medicalHistory: medicalHistory || null,
          allergies: allergies || null,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              createdAt: true,
            },
          },
        },
      });

      return patient;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Create patient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
