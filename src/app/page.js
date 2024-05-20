"use client";
import { FileContext } from "@/context/fileContext";
import { useContext } from "react";
import AudioWaveform from "./components/AudioWaveform";
import UploadAudio from "./components/UploadAudio";

const Page = () => {
  const { fileURL } = useContext(FileContext);
  console.log(fileURL);
  return (
    <div>
      {fileURL ? (
        <h1 style={{ textAlign: "center", margin: "1em 0" }}>
          Edit Your Audio File
        </h1>
      ) : (
        <h1 style={{ textAlign: "center", margin: "1em 0" }}>
          Upload Your Audio File
        </h1>
      )}
      {fileURL ? <AudioWaveform /> : <UploadAudio />}
    </div>
  );
};

export default Page;
