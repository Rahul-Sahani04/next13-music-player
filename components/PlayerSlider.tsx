"use client";

import * as RadixSlider from '@radix-ui/react-slider';

interface SlideProps {
  value?: number;
  duration?: number;
  onChange?: (value: number) => void;
}


const PlayerSlider: React.FC<SlideProps> = ({ 
  value = 0, 
  duration,
  onChange
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return ( 
    <RadixSlider.Root
      className="
        relative 
        flex 
        items-center 
        select-none 
        touch-none 
        w-full 
        h-10
        cursor-pointer
        top-[6px]
      "
      defaultValue={[0]}
      value={[value]}
      onValueChange={handleChange}
      max={duration}
      step={1}
      aria-label="Volume"
    >
      <RadixSlider.Track 
        className="
          bg-neutral-600 
          relative 
          grow 
          rounded-full 
          h-[3px]
          -top-5
        "
      >
        <RadixSlider.Range 
          className="
            absolute 
            bg-white 
            rounded-full 
            h-full
          " 
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
}
 
export default PlayerSlider;
