import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file1 = formData.get("file1") as File | null;
    const file2 = formData.get("file2") as File | null;

    if (!file1 || !file2) {
      return NextResponse.json({ error: "Missing files file1 or file2" }, { status: 400 });
    }

    const token = process.env.HF_TOKEN || process.env.NEXT_PUBLIC_HF_TOKEN;
    
    const client = await Client.connect("maxiu-uzumaki/satellite-interpolator-api", {
      hf_token: token,
    } as any);

    const result = await client.predict("/process_satellite_frames", {
      file1: file1,
      file2: file2,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API error during interpolation:", error);
    return NextResponse.json(
      { error: error.message || "Internal interpolation error" },
      { status: 500 }
    );
  }
}
