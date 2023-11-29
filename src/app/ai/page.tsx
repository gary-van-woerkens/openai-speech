"use client";

import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

import "github-markdown-css";

import MicIcon from "./_icons/mic-icon";
import UserIcon from "./_icons/user-icon";
import SendIcon from "./_icons/send-icon";
import RobotIcon from "./_icons/robot-icon";
import RecorderButton from "./recorder-button";
import SpinnerIcon from "./_icons/spinner-icon";

interface Message {
  content: string;
  role: "assistant" | "user" | "system";
}

const base64ToBlob = (base64: string) => {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: "audio/mp3" });
};

async function getAIResponse(messages: Message[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
  return await response.json();
}

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [messages, setMessages] = useState<Message[]>([]);

  function playAudio(audioBuffer: string) {
    const audioBlob = base64ToBlob(audioBuffer);
    const audioUrl = URL.createObjectURL(audioBlob);
    audio?.setAttribute("src", audioUrl);
    audio?.play();
  }

  async function addUserMessage(userMessage: string) {
    const m: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(m);
    setInputValue("");

    const { audio, message } = await getAIResponse(m);
    playAudio(audio);
    setMessages([...m, { role: "assistant", content: message }]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await addUserMessage(inputValue);
    setIsLoading(false);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
  }

  async function handleRecordStop(audioBlob: Blob) {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("file", audioBlob);

    const response = await fetch("/api/speech", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

    if (text.length) {
      await addUserMessage(text);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setAudio(new Audio());
  }, []);

  return (
    <>
      <div className="container mx-auto flex flex-col gap-y-6 pt-6">
        {messages.map((m, i) => (
          <div key={i} className={`message flex gap-x-3 ${m.role}`}>
            <div className={`relative self-start avatar`}>
              {m.role === "user" ? <UserIcon /> : <RobotIcon />}
            </div>
            <div className={`markdown-body flex-1 p-3 rounded shadow`}>
              <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="w-8 h-8 animate-spin">
              <SpinnerIcon />
            </div>
          </div>
        )}
      </div>

      <div className="tools bottom-0 w-full fixed">
        <div className="container mx-auto pl-11 flex pb-6 pt-12 gap-x-6">
          <form onSubmit={handleSubmit} className="flex-1 flex">
            <input
              value={inputValue}
              className="flex-1"
              onChange={handleInputChange}
              placeholder="Say something..."
            />
            <button type="submit">
              <SendIcon />
            </button>
          </form>
          <RecorderButton onStop={handleRecordStop}>
            <MicIcon />
          </RecorderButton>
        </div>
      </div>
    </>
  );
}
