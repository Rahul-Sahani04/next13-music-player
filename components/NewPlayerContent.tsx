import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import Slider from "./Slider";

// Icons
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
// import PlayerSlider from "./PlayerSlider";

import "./PlayerContent.css";
import { Song } from "@/types";

interface NewPlayerContentProps {
  song: Song;
  songUrl: string;
}

const NewPlayerContent: React.FC<NewPlayerContentProps> = ({
  song,
  songUrl,
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [seek, setSeek] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const howlRef = useRef<Howl | null>(null);

  // Icons
  const Icon = playing ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  useEffect(() => {
    howlRef.current = new Howl({
      src: [songUrl],
      html5: true,
      volume,
      onplay: () => {
        setPlaying(true);
        startTrackingElapsed();
      },
      onpause: () => {
        setPlaying(false);
        stopTrackingElapsed();
      },
      onend: () => {
        setPlaying(false);
        stopTrackingElapsed();
        setSeek(0);
        setElapsed(0);
      },
      onseek: (event) => {
        setSeek(event.seek);
        setElapsed(event.seek);
      },
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [songUrl, volume]);

  const startTrackingElapsed = () => {
    const intervalId = setInterval(() => {
      if (howlRef.current) {
        setElapsed(howlRef.current.seek());
        setSeek(howlRef.current.seek());
      }
    }, 1000);

    howlRef.current && (howlRef.current._intervalId = intervalId);
  };

  const stopTrackingElapsed = () => {
    clearInterval(howlRef.current?._intervalId);
    setElapsed(0);
  };

  const handlePlayPause = () => {
    if (howlRef.current) {
      if (playing) {
        howlRef.current.pause();
      } else {
        howlRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(0.5);
    } else {
      setVolume(0);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeek = parseFloat(e.target.value);
    setSeek(newSeek);
    if (howlRef.current) {
      howlRef.current.seek(newSeek);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {/* Seeker */}
      <div className="x-slider flex relative h-1.5 w-full -top-4 -left-4">
        <input
          className=" bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
          [&::-webkit-slider-thumb]:w-2.5
[&::-webkit-slider-thumb]:h-2.5
[&::-webkit-slider-thumb]:-mt-1.5
[&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
[&::-webkit-slider-thumb]:rounded-full
[&::-webkit-slider-thumb]:transition-all
[&::-webkit-slider-thumb]:duration-150
[&::-webkit-slider-thumb]:ease-in-out
[&::-webkit-slider-thumb]:dark:bg-slate-700

[&::-moz-range-thumb]:w-2.5
[&::-moz-range-thumb]:h-2.5
[&::-moz-range-thumb]:appearance-none
[&::-moz-range-thumb]:bg-white
[&::-moz-range-thumb]:border-4
[&::-moz-range-thumb]:border-blue-600
[&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:transition-all
[&::-moz-range-thumb]:duration-150
[&::-moz-range-thumb]:ease-in-out

[&::-webkit-slider-runnable-track]:w-full
[&::-webkit-slider-runnable-track]:h-2
[&::-webkit-slider-runnable-track]:bg-green-500
[&::-webkit-slider-runnable-track]:rounded-full
[&::-webkit-slider-runnable-track]:dark:bg-gray-700

[&::-moz-range-track]:w-full
[&::-moz-range-track]:h-2
[&::-moz-range-track]:bg-gray-100
[&::-moz-range-track]:rounded-full
          seeker-slider transition-all delay-200 ease-linear absolute z-50 w-full h-1.5 rounded-md bg-green-600 bg-gradient-to-r from-emerald-700 to-green-500"
          type="range"
          min={0}
          max={howlRef.current ? howlRef.current?.duration() : 1}
          step={1}
          value={seek}
          onChange={handleSeekChange}
        />
      </div>

      {/* Duration Container */}
      <div className="relative -top-3 flex flex-row flex-grow justify-start px-0.5">
        {/* Current Time */}
        <div className="text-gray-500/90 text-sm select-none">
          <span>
            {formatTime(elapsed) === "NaN:NaN" ? "00:00" : formatTime(elapsed)}
          </span>
        </div>

        {/* Grow Space */}
        <div className="grow"></div>

        {/* Total Time */}
        <div className="text-gray-400/90 text-sm select-none pr-1">
          <span>{formatTime(howlRef.current?.duration() || 0)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex absolute top-2 z-50 left-[40%] justify-evenly w-1/5 text-xl control-buttons">
        <button onClick={handlePlayPause}>
          <AiFillStepBackward />
        </button>
        <button
          className="text-2xl backdrop-blur-md bg-green-500 border-black rounded-full flex justify-center items-center w-10 h-10"
          onClick={handlePlayPause}
        >
          <Icon />
        </button>
        <button onClick={handlePlayPause}>
          <AiFillStepForward />
        </button>
      </div>

      {/* Volume Control */}
      <div className="relative -top-2 hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px] cursor-pointer">
          <VolumeIcon onClick={toggleMute} />{" "}
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default NewPlayerContent;
