"use client";

import { MoveHistoryProps } from "@/types";

export default function MoveHistory({ moves }: MoveHistoryProps) {
  // Format moves into an array of objects with moveNumber, white, and black
  const formattedMoves = moves.reduce<
    { moveNumber: number; white: string; black?: string }[]
  >((row, move, index) => {
    if (index % 2 === 0) {
      // Start a new move
      row.push({ moveNumber: row.length + 1, white: move });
    } else {
      // Add black's move to the last move
      row[row.length - 1].black = move;
    }
    return row;
  }, []);

  return (
    <div className="border-2 border-[#fed6ae] p-4 rounded-lg max-h-80 overflow-y-auto">
      <table className="w-full table-auto">
        <thead className="bg-[#1f1f1f]">
          <tr>
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">White</th>
            <th className="py-2 px-4 text-left">Black</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#fed6ae]">
          {formattedMoves.map((move, index) => (
            <tr key={index} className="bg-[#1f1f1f]">
              <td className="py-2 px-4">{move.moveNumber}</td>
              <td className="py-2 px-4">{move.white}</td>
              <td className="py-2 px-4">{move.black || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
