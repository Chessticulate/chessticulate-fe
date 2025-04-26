type Props = {
  fenStr: string;
  gameStatus: string;
};

export default function ChessboardStatus({ fenStr, gameStatus }: Props) {
  let statusMsg: string = "";

  if (gameStatus === "draw") {
    statusMsg = "Game over: draw";
  } else if (gameStatus === "insufficient material") {
    statusMsg = "Game over: draw by insufficient material";
  } else if (gameStatus === "three-fold repetition") {
    statusMsg = "Game over: draw by three-fold repetition";
  } else if (gameStatus === "fifty-move rule") {
    statusMsg = "Game over: draw by fifty-move rule";
  } else {
    if (fenStr.split(" ")[1] === "w") {
      if (gameStatus === "game over") {
        statusMsg = "Game over: black wins!";
      } else if (gameStatus === "check") {
        statusMsg = "White's turn: in check";
      } else {
        statusMsg = "White's turn";
      }
    } else {
      if (gameStatus === "game over") {
        statusMsg = "Game over: white wins!";
      } else if (gameStatus === "check") {
        statusMsg = "Black's turn: in check";
      } else {
        statusMsg = "Black's turn";
      }
    }
  }

  return (
    <p>{statusMsg}</p>
  );
};
