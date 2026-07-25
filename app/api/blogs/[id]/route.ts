import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, authenticateRequest } from "@/lib/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lookupBySlug = searchParams.get("slug") === "true";

    // Try to find by slug first, then by id
    let post;
    if (lookupBySlug) {
      post = await prisma.blogPost.findUnique({
        where: { slug: params.id },
      });
    } else {
      post = await prisma.blogPost.findUnique({
        where: { id: params.id },
      });
      // Fallback: try by slug if id lookup fails
      if (!post) {
        post = await prisma.blogPost.findUnique({
          where: { slug: params.id },
        });
      }
    }

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // If not published, only admins can view
    if (!post.published) {
      const user = await authenticateRequest(request);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Get blog post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, excerpt, content, coverImage, author, category, tags, published, featured } = body;

    // Regenerate slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = generateSlug(title);
      const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
      if (existingSlug && existingSlug.id !== params.id) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== existingPost.slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author !== undefined && { author }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(published !== undefined && { published }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json({ data: post });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Update blog post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id: params.id } });

    return NextResponse.json({ data: { message: "Blog post deleted successfully" } });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Delete blog post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
