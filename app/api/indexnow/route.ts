import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const urls: string[] = Array.isArray(body.urls)
      ? body.urls
      : [body.url];

    const validUrls = urls.filter(
      (url) =>
        typeof url === "string" &&
        url.startsWith("https://www.physiofix.net.com/")
    );

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs supplied" },
        { status: 400 }
      );
    }

    const key = process.env.INDEXNOW_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "INDEXNOW_KEY is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.indexnow.org/indexnow",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          host: "www.physiofix.net.com",
          key,
          keyLocation: `https://www.physiofix.net.com/${key}.txt`,
          urlList: validUrls,
        }),
      }
    );

    return NextResponse.json(
      {
        success: response.ok,
        status: response.status,
        submitted: validUrls,
      },
      { status: response.ok ? 200 : response.status }
    );
  } catch (error) {
    console.error("IndexNow error:", error);

    return NextResponse.json(
      { error: "Failed to submit URLs to IndexNow" },
      { status: 500 }
    );
  }
}