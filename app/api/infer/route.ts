import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { text } = await req.json();

    const res = await fetch(
        `https://router.huggingface.co/hf-inference/models/${process.env.HF_USERNAME}/${process.env.HF_MODEL_NAME}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
        }
    );

    const data = await res.json();
    return NextResponse.json(data);
}
