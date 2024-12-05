import {
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
  DragEvent,
  MouseEvent,
  useEffect,
} from "react";
import Image from "next/image";
import pieceMap from "../utils/piecetoPNG";
import { ChessboardProps, Square, GameData } from "@/types";

// Chess obj has a type of any since shallowpink does not export any types
// long term it might be best to create a chess interface
const Chess: any = require("shallowpink/lib/chess");

export default function Chessboard({ game }: ChessboardProps) {
  const chess = useMemo(() => new Chess(game?.fen), [game?.fen]);
  const [move, setMove] = useState<string>("");
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [startSquare, setStartSquare] = useState<Square | null>(null);
  // list of selectedPiece's move options
  const [moveOptions, setMoveOptions] = useState<string[] | null>(null);

  if (!game) {
    return <>no game data</>;
  }

  const { id, white, black, white_username, black_username, whomst, winner } =
    game;

  const currentPlayer = whomst === white ? white_username : black_username;
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const handleDrag = (
    e: DragEvent<HTMLImageElement>,
    piece: string,
    square: Square,
  ) => {
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSelect = (
    e: MouseEvent<HTMLImageElement>,
    piece: string,
    square: Square,
  ) => {
    setSelectedPiece(piece);
    setStartSquare(square);

    const chessPiece = chess.board.get(square.x, square.y);
    const moveDest = chess.legalMoves(chessPiece).map((move: string) => {
      return move.match(/[a-h][1-8]$/)?.[0] || move;
    });
    setMoveOptions(moveDest);

    // destination square = the last two chars from the right of any move string
    console.log("highlight move squares", moveDest);
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetSquare: Square,
  ) => {
    e.preventDefault();
    if (selectedPiece && startSquare) {
      const piece = chess.board.get(startSquare.x, startSquare.y);

      let moveStr = chess.generateMoveStrs(
        piece,
        targetSquare.x,
        targetSquare.y,
      )[0];

      console.log("move string", moveStr);

      // Castling
      if (["Kg1", "Kc1", "Kg8", "Kc8"].includes(moveStr)) {
        // Check if legalMoves includes either castling move
        if (moveOptions?.includes("O-O") || moveOptions?.includes("O-O-O")) {
          switch (moveStr) {
            case "Kg1":
            case "Kg8":
              moveStr = "O-O"; // Kingside castling
              break;
            case "Kc1":
            case "Kc8":
              moveStr = "O-O-O"; // Queenside castling
              break;
          }
        }
      }

      const moveResult = chess.move(moveStr);

      if (moveResult) {
        setMove(moveStr);
        await submitMove(moveStr);
      } else {
        console.error("Invalid move");
      }
    }
    setSelectedPiece(null);
    setStartSquare(null);
    setMoveOptions(null);
    setMove("");
  };

  const submitMove = async (move: string) => {
    try {
      const response = await fetch("/api/games/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, move }),
      });

      if (!response.ok) throw new Error("Network response is not ok");
      const data = await response.json();
      console.log("Move submitted:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderSquare = (row: string, col: string) => {
    const x = cols.indexOf(col);
    const y = rows.indexOf(row);
    const square = {
      notation: `${col}${row}`,
      x: x,
      y: y,
    };

    const piece = chess.board.get(x, y)?.toFEN();
    const isEvenSquare = (x + y) % 2 === 0;
    const squareColor = isEvenSquare ? "bg-[#f0d9b5]" : "bg-[#b58863]";

    return (
      <div
        key={square.notation}
        className={`relative flex justify-center items-center ${squareColor} w-16 h-16 ${moveOptions?.includes(square.notation) ? "border-4 border-green-600" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, square)}
      >
        {piece && (
          <Image
            src={pieceMap[piece]}
            alt="piece"
            width={56}
            height={56}
            draggable
            onDragStart={(e) => handleDrag(e, piece, square)}
            onMouseDown={(e) => handleSelect(e, piece, square)}
          />
        )}
      </div>
    );
  };

  const renderRow = (row: string) => (
    <div key={row} className="contents">
      {cols.map((col) => renderSquare(row, col))}
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-8 grid-rows-8 w-128 h-128">
        {rows.map((row) => renderRow(row))}
      </div>
      <div className="mt-4">
        <p>Current Player: {currentPlayer}</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" value={move} readOnly className="text-black" />
        </form>
      </div>
    </div>
  );
}
