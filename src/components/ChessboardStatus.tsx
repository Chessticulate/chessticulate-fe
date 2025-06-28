type Props = {
  fenStr: string;
  gameStatus: string;
};

export default function ChessboardStatus({ fenStr, gameStatus }: Props) {
  let statusMsg: string = "";

  if (gameStatus === "draw") {
    statusMsg = "Draw";
  } else if (gameStatus === "Insufficient Material") {
    statusMsg = "Draw: Insufficient Material";
  } else if (gameStatus === "Three-Fold Repetition") {
    statusMsg = "Draw: Three-Fold Repetition";
  } else if (gameStatus === "Fifty-Move Rule") {
    statusMsg = "Draw: Fifty-Move Rule";
  } else {
    if (fenStr.split(" ")[1] === "w") {
      if (gameStatus === "Game Over") {
        statusMsg = "Checkmate: Black Wins!";
      } else if (gameStatus === "check") {
        statusMsg = "White's Turn: In Check";
      } else {
        statusMsg = "White's Turn";
      }
    } else {
      if (gameStatus === "Game Over") {
        statusMsg = "Checkmate: White Wins!";
      } else if (gameStatus === "Check") {
        statusMsg = "Black's Turn: in Check";
      } else {
        statusMsg = "Black's Turn";
      }
    }
  }

  return (
    <div className="border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 md:ml-4 md:mb-2 lg:mt-0 lg:ml-4 lg:mb-2 overflow-y-auto w-full md:w-[200px] lg:w-[300px]">
      <p className="text-center whitespace-nowrap">{statusMsg}</p>
    </div>
  );
}
