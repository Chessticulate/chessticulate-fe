type Props = {
  fenStr: string;
  gameStatus: string;
};

export default function ChessboardStatus({ fenStr, gameStatus }: Props) {
  let statusMsg: string = "";

  if (gameStatus === "draw") {
    statusMsg = "Draw";
  } else if (gameStatus === "insufficient material") {
    statusMsg = "Draw: insufficient material";
  } else if (gameStatus === "three-fold repetition") {
    statusMsg = "Draw: three-fold repetition";
  } else if (gameStatus === "fifty-move rule") {
    statusMsg = "Draw: fifty-move rule";
  } else {
    if (fenStr.split(" ")[1] === "w") {
      if (gameStatus === "game over") {
        statusMsg = "Checkmate: black wins!";
      } else if (gameStatus === "check") {
        statusMsg = "White's turn: in check";
      } else {
        statusMsg = "White's turn";
      }
    } else {
      if (gameStatus === "game over") {
        statusMsg = "Checkmate: white wins!";
      } else if (gameStatus === "check") {
        statusMsg = "Black's turn: in check";
      } else {
        statusMsg = "Black's turn";
      }
    }
  }

  return (
    <div className="border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 md:ml-4 md:mb-2 lg:mt-0 lg:ml-4 lg:mb-2 overflow-y-auto w-full md:w-[200px] lg:w-[300px]">
      <p className="text-center whitespace-nowrap">{statusMsg}</p>
    </div>
  );
}
