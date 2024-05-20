"use client";
import { FileContext } from "@/context/fileContext";
import { useContext, useEffect, useRef, useState } from "react";
import wavesurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
const AudioWaveform = () => {
  const wavesurferRef = useRef(null);
  const timelineRef = useRef(null);

  const { fileURL } = useContext(FileContext);

  const [wavesurferObj, setWavesurferObj] = useState();

  const [playing, setPlaying] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (wavesurferRef.current && !wavesurferObj) {
      setWavesurferObj(
        wavesurfer.create({
          container: "#waveform",
          scrollParent: true,
          autoCenter: true,
          cursorColor: "violet",
          loopSelection: true,
          waveColor: "#e7e30ef5",
          progressColor: "purple",
          responsive: true,
          plugins: [
            TimelinePlugin.create({
              container: "#wave-timeline",
            }),
            RegionsPlugin.create({}),
          ],
        })
      );
    }
  }, [wavesurferRef, wavesurferObj]);

  useEffect(() => {
    if (fileURL && wavesurferObj) {
      wavesurferObj.load(fileURL);
    }
  }, [fileURL, wavesurferObj]);

  useEffect(() => {
    if (wavesurferObj) {
      wavesurferObj.on("ready", () => {
        wavesurferObj.play();
        wavesurferObj.enableDragSelection({});
        setDuration(Math.floor(wavesurferObj.getDuration()));
      });

      wavesurferObj.on("play", () => {
        setPlaying(true);
      });

      wavesurferObj.on("finish", () => {
        setPlaying(false);
      });

      wavesurferObj.on("region-updated", (region) => {
        const regions = region.wavesurfer.regions.list;
        const keys = Object.keys(regions);
        if (keys.length > 1) {
          regions[keys[0]].remove();
        }
      });
    }
  }, [wavesurferObj]);

  useEffect(() => {
    if (duration && wavesurferObj) {
      wavesurferObj.addRegion({
        start: Math.floor(duration / 2) - Math.floor(duration) / 5,
        end: Math.floor(duration / 2),
        color: "hsla(265, 100%, 86%, 0.4)",
      });
    }
  }, [duration, wavesurferObj]);

  const handlePlayPause = () => {
    wavesurferObj.playPause();
    setPlaying(!playing);
  };

  const handleReload = () => {
    wavesurferObj.stop();
    wavesurferObj.play();
    setPlaying(true);
  };

  const handleTrim = () => {
    if (wavesurferObj) {
      const region =
        wavesurferObj.regions.list[Object.keys(wavesurferObj.regions.list)[0]];

      if (region) {
        const start = region.start;
        const end = region.end;

        const original_buffer = wavesurferObj?.backend.buffer;

        const new_buffer = wavesurferObj.backend.ac.createBuffer(
          original_buffer.numberOfChannels,
          original_buffer.length,
          original_buffer.sampleRate
        );

        const first_list_index = start * original_buffer.sampleRate;
        const second_list_index = end * original_buffer.sampleRate;
        const second_list_mem_alloc =
          original_buffer.length - end * original_buffer.sampleRate;

        const new_list = new Float32Array(parseInt(first_list_index));

        const second_list = new Float32Array(parseInt(second_list_mem_alloc));

        const combined = new Float32Array(original_buffer.length);

        original_buffer.copyFromChannel(new_list, 1);
        original_buffer.copyFromChannel(new_list, 0);

        original_buffer.copyFromChannel(second_list, 1, second_list_index);
        original_buffer.copyFromChannel(second_list, 0, second_list_index);

        combined.set(new_list);
        combined.set(second_list, first_list_index);

        new_buffer.copyToChannel(combined, 1);
        new_buffer.copyToChannel(combined, 0);

        wavesurferObj.loadDecodedBuffer(new_buffer);
        console.log(
          "Trimmed audio loaded successfully new buffer: ",
          new_buffer
        );
      }
    }
  };

  return (
    <section className="waveform-container">
      <div ref={wavesurferRef} id="waveform" />
      <div ref={timelineRef} id="wave-timeline" />
      <div className="all-controls">
        <div className="left-container">
          <button
            title="play/pause"
            className="controls"
            onClick={handlePlayPause}
          >
            {playing ? <p>pause</p> : <p>play</p>}
          </button>
          <button title="reload" className="controls" onClick={handleReload}>
            <p className="material-icons">replay</p>
          </button>
          <button className="trim" onClick={handleTrim}>
            Trim
          </button>
        </div>
      </div>
    </section>
  );
};

export default AudioWaveform;
