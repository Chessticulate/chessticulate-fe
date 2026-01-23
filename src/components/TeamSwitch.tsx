import { ShallowpinkData, Color } from "@/types";

type Props = {
  currentTeam: Color;
  setShallowpink: (next: ShallowpinkData | ((prev: ShallowpinkData) => ShallowpinkData)) => void;
};
export default function TeamSwitch({ currentTeam, setShallowpink }: Props) {
  return (
    <div className="flex lg:w-[300px] ml-2 mr-2 mt-4 md:ml-4 md:mb-2 md:mt-0 lg:ml-4 lg:mb-2 lg:mt-0">
      <button
        onClick={() =>
          setShallowpink(prev =>
            prev.currentTeam === "black"
              ? { ...prev, currentTeam: "white" }
              : prev
          )
        }

        className={`hover:bg-outline hover:text-background flex-1 ${currentTeam === "white" ? "border-2 border-outline" : ""} bg-foreground pt-2 pb-2 w-full lg:w-auto`}
      >
        <p className="text-center w-full whitespace-nowrap">Play as White</p>
      </button>
      <button
        onClick={() =>
          setShallowpink(prev =>
            prev.currentTeam === "white"
              ? { ...prev, currentTeam: "black" }
              : prev
          )
        }
        className={`hover:bg-outline hover:text-background flex-1 ${currentTeam === "black" ? "border-2 border-outline" : ""} bg-foreground pt-2 pb-2 w-full lg:w-auto`}
      >
        <p className="text-center w-full whitespace-nowrap">Play as Black</p>
      </button>
    </div>
  );
}
