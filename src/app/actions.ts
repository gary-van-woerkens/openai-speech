"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(prevState: any, formData: FormData) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: JSON.parse((formData.get("messages") as string) || "[]"),
  });
  return { message: "This an AI response..." };
}
