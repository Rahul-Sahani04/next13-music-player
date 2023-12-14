import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import Slider from "./Slider";

// Icons
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
// import { BsPauseFill, BsPlayFill, HiSpeakerWave, HiSpeakerXMark, AiFillStepBackward, AiFillStepForward } from "react-icons/all";

// import PlayerSlider from "./PlayerSlider";

import "./PlayerContent.css";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import PlayerSlider from "./PlayerSlider";

interface NewPlayerContentProps {
  song: Song;
  songUrl: string;
}

const NewPlayerContent: React.FC<NewPlayerContentProps> = ({
  song,
  songUrl,
}) => {
  const player = usePlayer();
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
      setPlaying(!playing);
      playing ? howlRef.current.pause() : howlRef.current.play();

    }
  };

  const toggleMute = () => {
    setVolume(volume === 0 ? 0.5 : 0);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  }

  return (
    <div className="relative">
      {/* Seeker */}
      <div className="x-slider flex relative h-1.5 w-full -top-4 -left-4">
        {/*Add Player Slider */}
        <PlayerSlider
          value={seek}
          duration={howlRef.current?.duration() || 0}
          onChange={(value) => {
            if (howlRef.current) {
              howlRef.current.seek(value);
              setSeek(value);
            }
          }}
        />
      </div>

      {/* Duration Container */}
      <div className="relative -top-3 flex flex-row flex-grow justify-start px-0.5">
        {/* Current Time */}
        <div className="text-gray-500/90 text-sm select-none">
          <span>
            {formatTime(howlRef.current?.seek() || 0)}
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
        <button onClick={onPlayPrevious}>
          <AiFillStepBackward />
        </button>
        <button
          className="text-2xl backdrop-blur-md bg-green-500 border-black rounded-full flex justify-center items-center w-10 h-10"
          onClick={handlePlayPause}
        >
          <Icon />
        </button>
        <button onClick={onPlayNext}>
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
