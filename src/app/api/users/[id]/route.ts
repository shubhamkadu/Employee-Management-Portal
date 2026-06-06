import { NextRequest, NextResponse } from "next/server";

const DUMMYJSON_BASE = "https://dummyjson.com";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const targetUrl = `${DUMMYJSON_BASE}/users/${params.id}`;

  const response = await fetch(targetUrl, {
    headers: { "Content-Type": "application/json" },
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
