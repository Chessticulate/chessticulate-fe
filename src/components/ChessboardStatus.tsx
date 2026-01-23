
type Props = {
  fenStr: string;
  status: string;
};

export default function ChessboardStatus({ fenStr, status }: Props) {
  let statusMsg: string = "";

  if (status === "draw") {
    statusMsg = "Draw";
  } else if (status === "insufficient material") {
    statusMsg = "Draw: Insufficient Material";
  } else if (status === "three-fold repetition") {
    statusMsg = "Draw: Three-Fold Repetition";
  } else if (status === "fifty-move rule") {
    statusMsg = "Draw: Fifty-Move Rule";
  } else {
    if (fenStr.split(" ")[1] === "w") {
      if (status === "checkmate") {
        statusMsg = "Checkmate: Black Wins!";
      } else if (status === "check") {
        statusMsg = "White's Turn: In Check";
      } else {
        statusMsg = "White's Turn";
      }
    } else {
      if (status === "checkmate") {
        statusMsg = "Checkmate: White Wins!";
      } else if (status === "check") {
        statusMsg = "Black's Turn: in Check";
      } else {
        statusMsg = "Black's Turn";
      }
    }
  }

  return (
    <div className="border-2 border-outline bg-foreground p-2 mt-2 md:mt-0 md:ml-4 md:mb-2 lg:mt-0 lg:ml-4 lg:mb-2 overflow-y-auto w-full md:w-[200px] lg:w-[300px]">
      <p className="text-center whitespace-nowrap">{statusMsg}</p>
    </div>
  );
}
