import { ShallowpinkData, InitShallowpinkState } from "@/types";

type Props = {
  setGame: (
    s: ShallowpinkData | ((prev: ShallowpinkData) => ShallowpinkData),
  ) => void;
  setGameOver: (b: boolean) => void;
  setLastOrig: (n: number[]) => void;
  setLastDest: (n: number[]) => void;
};

export default function ResetButton({
  setGame,
  setGameOver,
  setLastOrig,
  setLastDest,
}: Props) {
  const reset = () => {
    setGame((prev) => ({
      ...InitShallowpinkState(),
      perspective: prev.perspective,
    }));
    setGameOver(false);
    setLastOrig([]);
    setLastDest([]);
  };

  return (
    <button
      onClick={reset}
      className="hover:bg-background hover:text-background flex border-2 border-outline bg-foreground p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
      <p className="text-center w-full whitespace-nowrap">Reset Board</p>
    </button>
  );
}
