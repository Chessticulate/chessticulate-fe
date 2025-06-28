import { Color } from "@/types";

type Props = {
  currentTeam: Color;
  setTeam(c: Color): void;
};
export default function TeamSwitcher({ currentTeam, setTeam }: Props) {
  return (
    <div className="flex lg:w-[300px] ml-2 mr-2 mt-4 md:ml-4 md:mb-2 md:mt-0 lg:ml-4 lg:mb-2 lg:mt-0">
      <button
        onClick={() => currentTeam === "black" && setTeam("white")}
        className={`hover:bg-[#fed6ae] hover:text-[#292929] flex-1 ${currentTeam === "white" ? "border-2 border-[#fed6ae]" : ""} bg-[#1f1f1f] pt-2 pb-2 w-full lg:w-auto`}
      >
        <p className="text-center w-full whitespace-nowrap">Play as White</p>
      </button>
      <button
        onClick={() => {
          currentTeam === "white" && setTeam("black");
        }}
        className={`hover:bg-[#fed6ae] hover:text-[#292929] flex-1 ${currentTeam === "black" ? "border-2 border-[#fed6ae]" : ""} bg-[#1f1f1f] pt-2 pb-2 w-full lg:w-auto`}
      >
        <p className="text-center w-full whitespace-nowrap">Play as Black</p>
      </button>
    </div>
  );
}
