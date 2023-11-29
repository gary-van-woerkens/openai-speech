import OpenAI from "openai";
import { ServerResponse } from "http";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

async function getAudio(input: string) {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

export async function POST(req: Request, res: ServerResponse) {
  const { messages } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo-1106",
    });
    const message = response["choices"][0]["message"]["content"];

    const buffer = await getAudio(message || "");
    const audio = buffer.toString("base64");

    return Response.json({ message, audio });
  } catch (error) {
    throw error;
  }
}
