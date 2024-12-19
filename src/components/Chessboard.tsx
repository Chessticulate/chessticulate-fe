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

  let id: number | null = null;
  let white: number | null = null;
  let black: number | null = null;
  let white_username: string | null = null;
  let black_username: string | null = null;
  let whomst: number | null = null;
  let winner: number | null = null;
  let currentPlayer: string | null = null;

  if (game) {
    ({ id, white, black, white_username, black_username, whomst, winner } =
      game);
    currentPlayer = whomst === white ? white_username : black_username;
  } else {
    currentPlayer = "analysis mode";
  }

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

      // long term it would be ideal to have shallowpink status codes
      // or some other way of grouping status types
      if (
        moveResult == "invalid move" ||
        moveResult == "player is still in check" ||
        moveResult == "move puts player in check"
      ) {
        console.error(moveResult);
      } else {
        console.log("moveResult", moveResult);
      }

      if (moveResult != "invalid move" && game) {
        setMove(moveStr);
        await submitMove(moveStr);
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
        className={`relative flex justify-center items-center ${squareColor}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, square)}
      >
        {moveOptions?.includes(square.notation) && (
          <div className="absolute w-6 h-6 bg-neutral-600 opacity-25 rounded-full"></div>
        )}
        {piece && (
          <Image
            src={pieceMap[piece]}
            alt="piece"
            width={72}
            height={72}
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
    <div className="flex justify-center">
      <div className="grid grid-cols-8 grid-rows-8">
        {rows.map((row) => renderRow(row))}
      </div>
    </div>
  );
}
