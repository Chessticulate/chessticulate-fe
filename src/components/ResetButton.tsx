type Props = {
  setFenString: (s: string) => void;
  setMoveHistory: (h: string[]) => void;
  setStates: (s: Map<number, number>) => void;
  setGameOver: (b: boolean) => void;
};

export default function ResetButton({
  setFenString,
  setMoveHistory,
  setStates,
  setGameOver,
}: Props) {
  const reset = () => {
    setFenString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setMoveHistory([]);
    setStates(new Map<number, number>());
    setGameOver(false);
  };

  return (
    <button
      onClick={reset}
      className="hover:bg-[#fed6ae] hover:text-[#292929] flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
      <p className="text-center w-full whitespace-nowrap">Reset Board</p>
    </button>
  );
}
