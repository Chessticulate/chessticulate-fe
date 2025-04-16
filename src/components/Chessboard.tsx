"use client";

import { useMemo, useState, DragEvent, MouseEvent } from "react";
import Image from "next/image";
import MoveHistory from "@/components/MoveHistory";

const Shallowpink = require("shallowpink");

const pieceMap: Record<string, string> = {
  P: "/img/white-pawn.png",
  N: "/img/white-knight.png",
  B: "/img/white-bishop.png",
  R: "/img/white-rook.png",
  Q: "/img/white-queen.png",
  K: "/img/white-king.png",
  p: "/img/black-pawn.png",
  n: "/img/black-knight.png",
  b: "/img/black-bishop.png",
  r: "/img/black-rook.png",
  q: "/img/black-queen.png",
  k: "/img/black-king.png",
};

type Props = {
  fen: string;
  states: Map<number, number>;
  moveHist: string[];
  submitMove(
    fen: string,
    states: Map<number, number>,
    move: string,
  ): Promise<void>;
};

type Coords = {
  x: number;
  y: number;
};

export default function Chessboard({
  fen,
  states,
  moveHist,
  submitMove,
}: Props) {
  const [selectedPiece, setSelectedPiece] = useState<Coords | null>(null);
  const [moveOptions, setMoveOptions] = useState<string[]>([]);

  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const handleSelect = (_: MouseEvent<HTMLImageElement>, coords: Coords) => {
    setSelectedPiece(coords);
    const chessObj = new Shallowpink(fen, states);
    const piece = chessObj.board.get(coords.x, coords.y);
    const options = chessObj.legalMoves(piece);
    console.log(
      `available moves for piece at (${coords.x},${coords.y}):`,
      options,
    );
    console.log("FEN STRING:", fen, "STATES:", states);
    setMoveOptions(options);
  };

  const handleDrop = async (_: DragEvent<HTMLDivElement>, dest: Coords) => {
    const chessObj = new Shallowpink(fen, states);
    const piece = selectedPiece
      ? chessObj.board.get(selectedPiece.x, selectedPiece.y)
      : null;
    if (piece) {
      const currTurn = chessObj.turn % 2 == 0 ? "black" : "white";
      if (piece.color != currTurn) {
        return;
      }

      let moveStr = chessObj.generateMoveStrs(piece, dest.x, dest.y)[0];

      // Castling
      if (["Kg1", "Kc1", "Kg8", "Kc8"].includes(moveStr)) {
        // Check if legalMoves includes either castling move
        if (moveOptions.includes("O-O") || moveOptions.includes("O-O-O")) {
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

      const moveResult = chessObj.move(moveStr);
      console.log(moveResult);

      // long term it would be ideal to have shallowpink status codes
      // or some other way of grouping status types
      if (
        moveResult == "invalid move" ||
        moveResult == "player is still in check" ||
        moveResult == "move puts player in check"
      ) {
        return;
      }

      await submitMove(chessObj.toFEN(), chessObj.states, moveStr);
    }

    setSelectedPiece(null);
    setMoveOptions([]);
  };

  const renderSquare = (row: string, col: string) => {
    const notation = `${col}${row}`;
    const x = cols.indexOf(col);
    const y = rows.indexOf(row);
    const isEvenSquare = (x + y) % 2 === 0;
    const squareColor = isEvenSquare ? "bg-[#f0d9b5]" : "bg-[#b58863]";
    const moveHere = moveOptions.find((move) => move.match(notation));
    const chessObj = new Shallowpink(fen, states);
    const piece = chessObj.board.get(x, y);
    return (
      <div
        key={notation}
        className={`relative flex justify-center items-center ${squareColor}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, { x, y })}
      >
        {moveHere &&
          (moveHere.match(/x/) ? (
            <div className="absolute w-6 h-6 bg-red-600 opacity-50 rounded-full"></div>
          ) : (
            <div className="absolute w-6 h-6 bg-neutral-600 opacity-25 rounded-full"></div>
          ))}

        {piece && (
          <Image
            src={pieceMap[piece.toFEN()]}
            alt="piece"
            width={72}
            height={72}
            onMouseDown={(e) => handleSelect(e, { x, y })}
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
    <div className="md:flex lg:flex justify-center">
      <div className="grid grid-cols-8 grid-rows-8 aspect-square w-screen md:size-[500px] lg:size-[700px]">
        {rows.map((row) => renderRow(row))}
      </div>
      <div className="lg:flex md:flex w-full md:h-[500px] lg:h-[700px] md:ml-4 lg:ml-4">
        <MoveHistory moves={moveHist} />
      </div>
    </div>
  );
}
