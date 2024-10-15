import { useMemo } from "react";
import { GameData } from "./games/GamesWindow";
import Image from "next/image";
import pieceMap from "../utils/piecetoPNG";

// Temporary type fix for Chess object
const Chess: any = require("shallowpink/lib/chess");

type ChessboardProps = {
  game: GameData | null;
};

export default function Chessboard({ game }: ChessboardProps) {
  const chess = useMemo(() => new Chess(), []);

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
    <div className="grid grid-cols-8 grid-rows-8 w-96 h-96 mx-auto">
      {rows.map((row) => renderRow(row))}
    </div>
  );
}
