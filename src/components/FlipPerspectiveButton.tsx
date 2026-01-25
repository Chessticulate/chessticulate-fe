type Props = {
  flipPerspective: (mode: string) => void;
  mode: string;
};

export default function FlipPerspectiveButton({
  flipPerspective,
  mode,
}: Props) {
  return (
    <button
      onClick={() => flipPerspective(mode)}
      className="hover:bg-outline hover:text-background flex border-2 border-outline bg-foreground p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
      <p className="text-center w-full whitespace-nowrap">Flip Perspective</p>
    </button>
  );
}
