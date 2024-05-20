import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export async function POST(req, res) {
  console.log("POST request received");
  const { fileURL, start, end } = req.body;

  // Trim the audio using ffmpeg
  const outputFilename = "trimmed_audio.wav";
  ffmpeg(fileURL)
    .setStartTime(start)
    .setDuration(end - start)
    .output(outputFilename)
    .on("end", () => {
      // Return the processed audio file
      const trimmedAudio = fs.readFileSync(outputFilename);
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=trimmed_audio.wav"
      );
      res.setHeader("Content-Type", "audio/wav");
      res.send(trimmedAudio);
    })
    .run();
}

// Path: src/app/api/trim-audio/route.js
