"use client";

// import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay, FaHeart } from "react-icons/fa";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className="
        relative 
        group 
        flex 
        items-center 
        overflow-hidden 
        gap-x-4 
        bg-neutral-100/10 
        cursor-pointer 
        hover:bg-neutral-100/20 
        transition 
        pr-4
        border-solid border-2 rounded-md border-zinc-200
      "
    >
      <div className="relative min-h-[64px] min-w-[64px] flex justify-center items-center group-hover:text-white">
        <FaHeart className="text-borderColors text-xl group-hover:text-white transition "/>
      </div>
      <p className="font-medium truncate py-5">{name}</p>
      <div
        className="
          absolute 
          transition 
          opacity-0 
          rounded-full 
          flex 
          items-center 
          justify-center 

          p-4 
          drop-shadow-md 
          right-5
          group-hover:opacity-100 
          hover:scale-110
        "
      >
        <div className="border-2 rounded-full border-borderColors w-10 h-10 flex justify-center items-center">
          <FaPlay className="text-borderColors" />
        </div>
      </div>
    </button>
  );
};

export default ListItem;
