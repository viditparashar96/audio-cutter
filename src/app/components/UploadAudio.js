"use client";
import { FileContext } from "@/context/fileContext";
import { useContext, useRef } from "react";

const UploadAudio = () => {
  const inputFile = useRef(null);
  const { setFileURL } = useContext(FileContext);
  const handleButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = (e) => {
    // console.log(file);
    setFileURL(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="upload-audio">
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
