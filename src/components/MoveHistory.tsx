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

    <div className="lg:flex md:flex w-full md:h-[295px] lg:h-[495px] md:ml-4 lg:ml-4">
      <div className="border-2 border-[#fed6ae] bg-[#1f1f1f] p-4 mt-2 md:mt-0 lg:mt-0 overflow-y-auto md:w-[200px] lg:w-[300px]">
        <table className="w-full table-auto">
          <thead className="bg-[#1f1f1f] sticky top-0">
            <tr>
              <th className="py-2 px-2 text-left text-sm md:text-lg lg:text-xl">
                #
              </th>
              <th className="py-2 px-2 text-left text-sm md:text-lg lg:text-xl">
                White
              </th>
              <th className="py-2 px-2 text-left text-sm md:text-lg lg:text-xl">
                Black
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fed6ae]">
            {formattedMoves.map((move, index) => (
              <tr key={index}>
                <td className="py-2 px-4 text-sm md:text-lg lg:text-xl">
                  {move.moveNumber}
                </td>
                <td className="py-2 px-4 text-sm md:text-lg lg:text-xl">
                  {move.white}
                </td>
                <td className="py-2 px-4 text-sm md:text-lg lg:text-xl">
                  {move.black || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
