import OpenAI, { toFile } from "openai";

import { WriteStream, createReadStream, createWriteStream } from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const blob = formData.get("file") as Blob;

  try {
    const transcript = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: await toFile(blob, "audio.mp3"),
    });

    return new Response(transcript.text);
  } catch (error) {
    console.log(error);
    return new Response("");
  }
}
