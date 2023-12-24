import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
  return ( 
    <button
      className="
      border-solid
      border-2
    border-borderColors

    bg-neutral-600

      backdrop-blur-md
        transition 
        opacity-0 
        rounded-full 
        flex 
        items-center 
        justify-center 

        p-2
        drop-shadow-md 
        translate
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
        hover:scale-110
        w-10
        h-10
      "
    >
      <FaPlay className="text-borderColors text-xs" />
    </button>
   );
}
 
export default PlayButton;
