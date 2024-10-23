import { useMemo, useState, ChangeEvent, FormEvent } from "react";
import { GameData } from "./games/GamesWindow";
import Image from "next/image";
import pieceMap from "../utils/piecetoPNG";

// Temporary type fix for Chess object
const Chess: any = require("shallowpink/lib/chess");

type ChessboardProps = {
  game: GameData | null;
};

export default function Chessboard({ game }: ChessboardProps) {
  const chess = useMemo(() => new Chess(game?.fen), [game?.fen]);
  const [move, setMove] = useState<string>("");

  if (!game) {
    return <div>No game data available</div>;
  }

  const {
    id,
    white,
    black,
    white_username,
    black_username,
    whomst,
    winner,
    fen,
  } = game;

  const currentPlayer = whomst === white ? white_username : black_username;

  const handleMoveChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMove(e.target.value);
  };

  const handleMove = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/games/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, move }),
      });

      if (!response.ok) {
        throw new Error("Network response is not ok");
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const renderSquare = (row: string, col: string) => {
    const x = cols.indexOf(col);
    const y = rows.indexOf(row);

    const isEvenRow = x % 2 === 0;
    const isEvenCol = y % 2 === 0;
    const isEvenSquare = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol);

    const squareColor = isEvenSquare ? "bg-[#f0d9b5]" : "bg-[#b58863]";
    const piece = chess.board.get(x, y)?.toFEN();

    return (
      <div
        key={`${row}${col}`}
        className={`relative flex justify-center items-center ${squareColor} w-12 h-12`}
      >
        {piece && (
          <Image
            src={pieceMap[piece]}
            alt={`Chess piece ${piece}`}
            width={48}
            height={48}
            className="pieces"
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
      <div className="grid grid-cols-8 grid-rows-8 w-96 h-96 mx-auto">
        {rows.map((row) => renderRow(row))}
      </div>
      <div className="">
        {currentPlayer}
        <form onSubmit={handleMove}>
          <div>
            <input
              type="text"
              value={move}
              onChange={handleMoveChange}
              placeholder="move"
              className="text-black"
            />
          </div>
          <button
            type="submit"
            className="pl-4 mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            submit move
          </button>
        </form>
      </div>
    </div>
  );
}
