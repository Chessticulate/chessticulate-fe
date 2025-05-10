import LoginSignup from "@/components/LoginSignup";
import { Banner } from "@/components/Banner";

export default function Signup() {
  const reset = () => {

  };

  return (
    <div className="block max-w-full">
      <div className="flex md:block lg:block">
        <div className="ml-2 mt-2 md:m-0 lg:m-0">
          <div className="border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 md:mb-2 lg:mb-2 overflow-y-auto">
            <p className="text-center whitespace-nowrap">White's turn</p>
          </div>
        </div>
        <div className="ml-2 mr-2 mt-4 md:m-0 lg:m-0 lg:mb-2">
          <button
          className="hover:bg-[#fed6ae] hover:text-[#292929] flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
          >
          <p className="text-center w-full whitespace-nowrap">Reset board</p>
          </button>
        </div>
        <div className="mr-2 mt-2 md:mr-0 lg:mr-0">
          <div className="block">
              <div className="flex">
                  <div className="max-w-full flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 md:mb-2 lg:mb-2 md:w-[200px] md:w-[200px] lg:w-[300px]">
                      <div className="mr-2">
                        <button className="hover:bg-[#fed6ae] hover:text-[#292929]">FEN:</button>
                      </div>
                      <p className="overflow-x-auto whitespace-nowrap">
                        <em>rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1</em>
                      </p>
                  </div>
              </div>
              <p className={`text-center text-xs pb-2`}>copied FEN to clipboard</p>
          </div>
        </div>
      </div>
      <div className="block">
        <div className="flex">
          <div className="overflow-x-auto flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 md:mb-2 lg:mb-2 w-full md:w-[200px] lg:w-[300px]">
            <div className="whitespace-nowrap mr-2">
              <button className="hover:bg-[#fed6ae] hover:text-[#292929]">Set FEN:</button>
            </div>
            <input type="text" placeholder="custom FEN string..." className="overflow-x-auto whitespace-nowrap bg-[#1f1f1f] md:w-[100px] lg:w-[180px]"/>
          </div>
        </div>
        <p className={`text-center text-xs pb-2`}>invalid FEN string</p>
      </div>
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
              <tr>
                <td className="py-2 px-4 text-sm md:text-lg lg:text-xl">
                  1
                </td>
                <td className="py-2 px-4 text-sm md:text-lg lg:text-xl">
                  e4
                </td>
                <td className="py-2 px-4 text-sm md:text-lg lg:text-xl">
                  d6
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
