"use client";
import { FileContext } from "@/context/fileContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const UploadAudio = () => {
  const router = useRouter();
  const inputFile = useRef(null);
  const { fileURL, setFileURL } = useContext(FileContext);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      setFileURL(file);
      router.push("/edit");
    }
  }, [file, setFileURL, router]);

  const handleButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = (e) => {
    // console.log(file);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="upload-audio">
      <h1>Upload your audio file here</h1>
      <button className="upload-btn" onClick={handleButtonClick}>
        Upload
      </button>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        accept="audio/*"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default UploadAudio;
