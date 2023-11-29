import { useState, useEffect, useRef } from "react";

type UseRecorderResult = {
  volume: number;
  isRecording: boolean;
  audioBlob: Blob | null;
  stopRecording: () => void;
  startRecording: () => void;
};

export default function useRecorder(): UseRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [volume, setVolume] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const source = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    async function initRecorder() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      source.current = audioContext.current.createMediaStreamSource(stream);
      source.current.connect(analyser.current);

      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!isRecording || !analyser.current) return;

        analyser.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / bufferLength;
        setVolume(avg);
        requestAnimationFrame(updateVolume);
      };

      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.addEventListener(
        "dataavailable",
        (event: BlobEvent) => {
          const blob = event.data;
          setAudioBlob(blob);
        },
      );

      if (isRecording) {
        mediaRecorder.current.start();
        updateVolume();
      }
    }

    if (isRecording) {
      initRecorder();
    } else {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close();
      }
    }

    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close();
      }
    };
  }, [isRecording]);

  function startRecording() {
    setIsRecording(true);
  }

  function stopRecording() {
    setIsRecording(false);
  }

  return { isRecording, startRecording, stopRecording, audioBlob, volume };
}
