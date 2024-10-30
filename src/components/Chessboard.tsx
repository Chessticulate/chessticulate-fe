import {
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
  DragEvent,
  useEffect,
} from "react";
import { GameData } from "./games/GamesWindow";
import Image from "next/image";
import pieceMap from "../utils/piecetoPNG";

// Temporary type fix for Chess object
const Chess: any = require("shallowpink/lib/chess");

type ChessboardProps = {
  game: GameData | null;
};

type Square = {
  notation: string;
  x: number;
  y: number;
};

export default function Chessboard({ game }: ChessboardProps) {
  const chess = useMemo(() => new Chess(game?.fen), [game?.fen]);
  const [move, setMove] = useState<string>("");
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [startSquare, setStartSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>(() =>
    chess.legalMoves(),
  );

  useEffect(() => {
    const moves = chess.legalMoves();
    setLegalMoves(moves);
    console.log("legal moves", moves);
  }, [move, chess]);

  if (!game) {
    return <>no game data</>;
  }

  const { id, white, black, white_username, black_username, whomst, winner } =
    game;

  const currentPlayer = whomst === white ? white_username : black_username;
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const handleDragStart = (
    e: DragEvent<HTMLImageElement>,
    piece: string,
    square: Square,
  ) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedPiece(piece);
    setStartSquare(square);
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetSquare: Square,
  ) => {
    e.preventDefault();
    if (draggedPiece && startSquare) {
      const piece = chess.board.get(startSquare.x, startSquare.y);
      const moveStr = chess.generateMoveStrs(
        piece,
        targetSquare.x,
        targetSquare.y,
      )[0];

      console.log("move string", moveStr);

      const moveResult = chess.move(moveStr);

      if (moveResult) {
        setMove(moveStr);
        await submitMove(moveStr);
      } else {
        console.error("Invalid move");
      }
    }
    setDraggedPiece(null);
    setStartSquare(null);
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
        className={`relative flex justify-center items-center ${squareColor} w-16 h-16`}
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
            onDragStart={(e) => handleDragStart(e, piece, square)}
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
