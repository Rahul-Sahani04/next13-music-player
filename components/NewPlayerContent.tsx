import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import Slider from "./Slider";

import Image from "next/image";

// Icons
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
// import { BsPauseFill, BsPlayFill, HiSpeakerWave, HiSpeakerXMark, AiFillStepBackward, AiFillStepForward } from "react-icons/all";

import "./PlayerContent.css";

import LikeButton from "./LikeButton";

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

  const [rotating, setRotating] = useState(0);

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
        if (playing) {
          setRotating((prevRotating) => (prevRotating + 1) % 360);
        }
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
  };

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
  };

  return (
    <div>
      <div className="flex flex-column -z-0 left-[0%] -top-[200%] w-96 h-96 absolute mix-blend-multiply">
        <Image
          className={`w-full h-full object-cover mix-blend-overlay animate-spin-slow`}
          src={"/images/DiscPlayer.png"}
          fill
          alt="Image"
          style={{ animationPlayState: playing ? "running" : "paused" }}
        />
      </div>

      <div className="relative grid grid-cols-3 z-50 bg-black">
        <div className="relative w-full flex items-center justify-start">
          <div className="absolute left-[22%]  w-32 h-32 object-center object-cover rounded-full overflow-hidden flex "
          style={{
            top: "-120%"
          }}
          >
            <img
            className="w-full object-cover"
              src={
                "https://kwjoxwvgneapgyyvfzvg.supabase.co/storage/v1/object/public/images/" +
                song.image_path
              }
            />
          </div>
          <div className="ml-4 absolute left-[50%]">
            <p className="font-sans text-base">{song.title}</p>
            <p className="font-sans text-gray-400 text-xs">{song.author}</p>
          </div>
        </div>
        {/* Seeker */}
        <div className=" flex relative h-1.5 w-full ">
          <div>
            {/* Control Buttons */}
            <div className="flex absolute  z-50 justify-evenly w-full text-xl control-buttons">
              <button
                onClick={onPlayPrevious}
                className="opacity-40 hover:scale-110 hover:opacity-100 transition-all delay-100 ease-linear"
              >
                <AiFillStepBackward />
              </button>
              <button
                className="hover:scale-110 bg-white text-black text-2xl backdrop-blur-md bg-green-500 border-black rounded-full flex justify-center items-center w-10 h-10 transition-all delay-200 ease-linear"
                onClick={handlePlayPause}
              >
                <Icon className="text-black" />
              </button>
              <button
                onClick={onPlayNext}
                className="opacity-40 hover:scale-110 hover:opacity-100 transition-all delay-100 ease-linear"
              >
                <AiFillStepForward />
              </button>
            </div>
            {/* Duration Container */}
            <div className="w-full absolute flex justify-center items-center top-12">
              <div className="relative  flex flex-row flex-grow justify-start  px-0.5">
                {/* Current Time */}
                <div className="text-gray-500/90 text-sm select-none">
                  <span>{formatTime(howlRef.current?.seek() || 0)}</span>
                </div>

                <div className="grow m-1 flex justify-center items-center">
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

                {/* Total Time */}
                <div className="text-gray-400/90 text-sm select-none pr-1">
                  <span>{formatTime(howlRef.current?.duration() || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="relative -top-2 hidden md:flex w-full justify-end pr-2">
          <div className="absolute h-full flex items-center right-[30%]">
            <LikeButton songId={song.id} />
          </div>
          <div className="flex items-center gap-x-2 w-[120px] ">
            <VolumeIcon onClick={toggleMute} className="cursor-pointer" />{" "}
            <Slider value={volume} onChange={(value) => setVolume(value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPlayerContent;
