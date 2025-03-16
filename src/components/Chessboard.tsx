"use client";

import {
  useMemo,
  useState,
  DragEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import MoveHistory from "@/components/MoveHistory";

// Chess obj has a type of any since shallowpink does not export any types
// long term it might be best to create a chess interface
//const Chess: any = require("shallowpink/lib/chess");
const Chess: any = require("@/../../shallowpink")

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
  fenString: string;
  setFenString(s: string): void;
  states: any;
  setStates(s: any): void;
  moveHist: string[];
  setMoveHist(h: string[]): void;
  submitMove(move: string): Promise<void>;
};

export default function Chessboard({
  fenString,
  setFenString,
  states,
  setStates,
  moveHist,
  setMoveHist,
  submitMove,
}: Props) {
  const chess = useMemo(() => new Chess(fenString, states), [fenString]);
  const [selectedPiece, setSelectedPiece] = useState<any | null>(null);
  const [moveOptions, setMoveOptions] = useState<string[]>([]);

  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const handleSelect = (
    _: MouseEvent<HTMLImageElement>,
    piece: any,
  ) => {
    setSelectedPiece(piece);
    const options = chess.legalMoves(piece);
    console.log(`available moves for piece at ${piece.x}${piece.y}:`, options)
    setMoveOptions(options);
  };

  const handleDrop = async (
    _: DragEvent<HTMLDivElement>,
    targetX: number,
    targetY: number,
  ) => {
    if (selectedPiece) {
      const currTurn = (chess.turn % 2 == 0 ? "black" : "white");
      if (selectedPiece.color != currTurn) {
        console.log("currTurn:", currTurn)
        console.log("selectedPiece.color:", selectedPiece.color)
        return;
      }

      let moveStr = chess.generateMoveStrs(
        selectedPiece,
        targetX,
        targetY,
      )[0];

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

      const moveResult = chess.move(moveStr);
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

      await submitMove(moveStr);

      setMoveHist([...moveHist, moveStr]);
      setFenString(chess.toFEN());
      setStates(chess.states);
    }

    setSelectedPiece(null);
    setMoveOptions([]);
  };

  const renderSquare = (row: string, col: string) => {
    const notation = `${col}${row}`
    const x = cols.indexOf(col);
    const y = rows.indexOf(row);
    const isEvenSquare = (x + y) % 2 === 0;
    const squareColor = isEvenSquare ? "bg-[#f0d9b5]" : "bg-[#b58863]";
    const moveHere = moveOptions.find((move) => move.match(notation));

    const piece = chess.board.get(x, y);
    return (
      <div
        key={notation}
        className={`relative flex justify-center items-center ${squareColor}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, x, y)}
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
            onMouseDown={(e) => handleSelect(e, piece)}
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
      <div className="grid grid-cols-8 grid-rows-8 aspect-square size-[700px]">
        {rows.map((row) => renderRow(row))}
      </div>
      <div className="flex h-[700px] ml-4">
        <MoveHistory moves={moveHist} />
      </div>
    </div>
  );
}
