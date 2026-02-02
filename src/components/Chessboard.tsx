"use client";

import { useState, useEffect, useRef, DragEvent, MouseEvent } from "react";
import Image from "next/image";
import { ShallowpinkData, GameData, SubmitMove } from "@/types";

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
  game: ShallowpinkData | GameData;
  submitMove: SubmitMove;
  gameOver: boolean;
  setGameOver: (b: boolean) => void;
  lastOrig: number[];
  lastDest: number[];
  setLastOrig: (n: number[]) => void;
  setLastDest: (n: number[]) => void;
};

type Coords = {
  x: number;
  y: number;
};

export default function Chessboard({
  game,
  submitMove,
  gameOver,
  setGameOver,
  lastOrig,
  lastDest,
  setLastOrig,
  setLastDest,
}: Props) {
  const [selectedPiece, setSelectedPiece] = useState<Coords | null>(null);
  const [moveOptions, setMoveOptions] = useState<string[]>([]);

  const boardRef = useRef<HTMLDivElement>(null);

  let rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  let cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  if (game.perspective === "black") {
    rows = rows.reverse();
    cols = cols.reverse();
  }

  const selectNewPiece = (coords: Coords) => {
    // currently, the currentGame gameMode (pvp) does not have a states field
    // the api needs to be updated to include states in getGames and update responses
    const chessObj = new Shallowpink(game.fen, game?.states);
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

    // Castle squares are pushed on to moveOptions for move highlighting
    if (options.includes("O-O")) {
      if (currTurn === "white") {
        options.push("Kg1");
      } else {
        options.push("Kg8");
      }
    }
    if (options.includes("O-O-O")) {
      if (currTurn === "white") {
        options.push("Kc1");
      } else {
        options.push("Kc8");
      }
    }

    setMoveOptions(options);
  };

  const handleSelect = (_: MouseEvent<any>, coords: Coords) => {
    if (gameOver) return;

    if (!selectedPiece) {
      selectNewPiece(coords);
    } else if (selectedPiece.x === coords.x && selectedPiece.y === coords.y) {
      setSelectedPiece(null);
      setMoveOptions([]);
    } else {
      handleDrop(null, coords);
    }
  };

  const handleDrop = async (
    _: DragEvent<HTMLDivElement> | null,
    dest: Coords,
  ) => {
    const chessObj = new Shallowpink(game.fen, game?.states);
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

      // cleanedMoveOptions is necessary to match move provided by genMoveStrs with
      // legalMoves. genMoveStrs does not contain suffix, but legalMoves does
      let cleanedMoveOptions = moveOptions.map((move) =>
        move.replace(/[+#]/g, ""),
      );
      let moveIndex = cleanedMoveOptions.findIndex((move) => move === moveStr);

      // Castling
      if (["Kg1", "Kc1", "Kg8", "Kc8"].includes(moveStr)) {
        // Check if legalMoves includes either castling move
        if (
          cleanedMoveOptions.includes("O-O") ||
          cleanedMoveOptions.includes("O-O-O")
        ) {
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
      if (cleanedMoveOptions.includes(moveStr)) {
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

      await submitMove({
        move: moveOptions[moveIndex],
        fen: chessObj.toFEN(),
        states: chessObj.states,
        status: moveResult,
      });

      if (chessObj.gameOver) {
        setGameOver(true);
      }
    }

    setLastOrig(chessObj.lastOrig);
    setLastDest(chessObj.lastDest);
    setSelectedPiece(null);
    setMoveOptions([]);
  };

  useEffect(() => {
    // use browser DOM Mouse Event, not reacts
    const handleClick = (e: globalThis.MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(e.target as Node)) {
        setSelectedPiece(null);
        setMoveOptions([]);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const renderSquare = (row: string, col: string) => {
    const notation = `${col}${row}`;
    const x =
      game.perspective === "white" ? cols.indexOf(col) : 7 - cols.indexOf(col);
    const y =
      game.perspective === "white" ? rows.indexOf(row) : 7 - rows.indexOf(row);
    const isEvenSquare = (x + y) % 2 === 0;
    const squareColor = isEvenSquare ? "bg-light-square" : "bg-dark-square";
    const notationColor = !isEvenSquare
      ? "text-light-square"
      : "text-dark-square";
    const moveHere = moveOptions.find((move) => move.match(notation));
    const chessObj = new Shallowpink(game.fen, game?.states);
    const piece = chessObj.board.get(x, y);
    return (
      <div
        key={notation}
        className={`relative flex justify-center items-center ${squareColor} z-0 ${
          moveHere ? "group" : ""
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, { x, y })}
        onMouseDown={(e) => handleSelect(e, { x, y })}
      >
        {moveHere &&
          (moveHere.match(/x/) ? (
            <div className="absolute inset-0 border-4 md:border-8 border-neutral-600 opacity-25 rounded-full group-hover:rounded-none z-10"></div>
          ) : (
            <div
              className="absolute w-3 md:w-6 h-3 md:h-6 bg-neutral-600 opacity-25 rounded-full 
              group-hover:bg-transparent group-hover:w-full group-hover:h-full group-hover:rounded-none
               group-hover:border-4 group-hover:md:border-8 group-hover:border-neutral-600 z-10"
            ></div>
          ))}

        {piece && (
          <Image
            className="z-20"
            src={pieceMap[piece.toFEN()]}
            alt="piece"
            width={72}
            height={72}
            onDragStart={(e) => {
              // removes green plus sign from image being dragged
              e.dataTransfer.dropEffect = "move";
              e.dataTransfer.effectAllowed = "move";
            }}
          />
        )}
        {/* selected piece and lastorig are often the same, but should be handled separately */}
        {selectedPiece && selectedPiece.x === x && selectedPiece.y === y && (
          <div className="absolute inset-0 bg-yellow-400 opacity-40 z-10"></div>
        )}
        {lastOrig && lastOrig[0] === x && lastOrig[1] === y && (
          <div className="absolute inset-0 bg-yellow-400 opacity-40 z-10"></div>
        )}
        {lastDest && lastDest[0] === x && lastDest[1] === y && (
          <div className="absolute inset-0 bg-yellow-400 opacity-40 z-10"></div>
        )}

        {row === "1" &&
          (game.perspective === "white" ? (
            <div
              className={`absolute bottom-0 right-0 lg:right-1 text-xs lg:font-bold lg:text-lg ${notationColor}`}
            >
              {col}
            </div>
          ) : (
            <div
              className={`absolute top-0 left-0 lg:left-1 text-xs lg:font-bold lg:text-lg ${notationColor}`}
            >
              {col}
            </div>
          ))}
        {col === "a" &&
          (game.perspective === "white" ? (
            <div
              className={`absolute top-0 left-0 lg:left-1 text-xs lg:font-bold lg:text-lg ${notationColor}`}
            >
              {row}
            </div>
          ) : (
            <div
              className={`absolute bottom-0 right-0 lg:right-1 text-xs lg:font-bold lg:text-lg ${notationColor}`}
            >
              {row}
            </div>
          ))}
      </div>
    );
  };

  const renderRow = (row: string) => (
    <div key={row} className="contents">
      {cols.map((col) => renderSquare(row, col))}
    </div>
  );

  return (
    <div
      ref={boardRef}
      className="grid grid-cols-8 grid-rows-8 aspect-square w-full md:size-[650px] lg:size-[750px]"
    >
      {rows.map((row) => renderRow(row))}
    </div>
  );
}
