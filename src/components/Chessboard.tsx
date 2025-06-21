"use client";

import { useMemo, useState, DragEvent, MouseEvent } from "react";
import Image from "next/image";

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
  submitMove(
    fen: string,
    states: Map<number, number>,
    move: string,
    gameStatus: string,
  ): Promise<void>;
};

type Coords = {
  x: number;
  y: number;
};

export default function Chessboard({
  fen,
  states,
  submitMove,
}: Props) {
  const [selectedPiece, setSelectedPiece] = useState<Coords | null>(null);
  const [moveOptions, setMoveOptions] = useState<string[]>([]);

  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const selectNewPiece = (coords: Coords) => {
    const chessObj = new Shallowpink(fen, states);
    const piece = chessObj.board.get(coords.x, coords.y);
    if (piece === null) {
      return;
    }
    const currTurn = chessObj.turn % 2 == 0 ? "black" : "white";
    if (piece.color != currTurn) {
      return;
    }
    setSelectedPiece(coords);
    const options = chessObj.legalMoves(piece);
    setMoveOptions(options);
  };

  const handleSelect = (_: MouseEvent<any>, coords: Coords) => {
    if (selectedPiece == null) {
      selectNewPiece(coords);
    } else {
      handleDrop(null, coords);
    }
  };

  const handleDrop = async (_: DragEvent<HTMLDivElement> | null, dest: Coords) => {
    const chessObj = new Shallowpink(fen, states);
    const piece = selectedPiece
      ? chessObj.board.get(selectedPiece.x, selectedPiece.y)
      : null;
    if (piece) {
      const currTurn = chessObj.turn % 2 == 0 ? "black" : "white";
      if (piece.color != currTurn) {
        setSelectedPiece(null);
        setMoveOptions([]);
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

      let moveResult = "invalid move";
      if (moveOptions.includes(moveStr)) {
        moveResult = chessObj.move(moveStr);
      }

      // long term it would be ideal to have shallowpink status codes
      // or some other way of grouping status types
      if (
        moveResult == "invalid move" ||
        moveResult == "player is still in check" ||
        moveResult == "move puts player in check"
      ) {
        const piece = chessObj.board.get(dest.x, dest.y);
        if (piece && piece.color === currTurn) {
          selectNewPiece(dest);
          return;
        }
        setSelectedPiece(null);
        setMoveOptions([]);
        return;
      }

      await submitMove(chessObj.toFEN(), chessObj.states, moveStr, moveResult);
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
        onMouseDown={(e) => handleSelect(e, { x, y })}
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
      <div className="grid grid-cols-8 grid-rows-8 aspect-square w-screen md:size-[650px] lg:size-[750px]">
        {rows.map((row) => renderRow(row))}
      </div>
  );
}
