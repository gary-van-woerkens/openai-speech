import { ReactNode, useEffect, useRef } from "react";

import useRecorder from "../_hooks/use-recorder";

export default function RecorderButton({
  onStop,
  children,
  className = "",
}: {
  className?: string;
  children?: ReactNode;
  onStop: (audioBlob: Blob) => void;
}) {
  const { isRecording, startRecording, stopRecording, audioBlob, volume } =
    useRecorder();

  const audioBlobRef = useRef<Blob>();

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    if (audioBlob && audioBlobRef.current !== audioBlob) {
      onStop(audioBlob);
      audioBlobRef.current = audioBlob;
    }
  }, [audioBlob, onStop]);

  return (
    <button
      onClick={handleClick}
      className={`${className} ${
        isRecording ? "recording" : ""
      } recorder-button`}
      // style={{
      //   backgroundColor: `rgba(125, 125, 125, ${
      //     isRecording ? volume / 25.5 : 0
      //   })`,
      // }}
    >
      {children}
      {/* {isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"} */}
    </button>
  );
}
