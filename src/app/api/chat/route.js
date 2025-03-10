import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        // Parse incoming JSON
        const { message } = await req.json();
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Ensure API key is present
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ_API_KEY is missing");
            return NextResponse.json({ error: "Missing API key" }, { status: 500 });
        }

        // Call the Groq API
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json({ reply: response.data.choices[0].message.content });

    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
