type Props = {
  flipPerspective: () => void;
};

export default function ResetButton({ flipPerspective }: Props) {

  return (
    <button
      onClick={flipPerspective}
      className="hover:bg-[#fed6ae] hover:text-[#292929] flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
      <p className="text-center w-full whitespace-nowrap">Flip Perspective</p>
    </button>
  );
}
