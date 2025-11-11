import { Link } from "react-router-dom";
import {Rows4, Trophy, Newspaper} from "lucide-react"
function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm relative z-20 md:px-[10%] lg:px-[20%] mb-8">
      <div className="flex flex-1 justify-around  [&>a]:bg-accent1 [&>a]:py-2 [&>a]:px-4 [&>a]:rounded-md font-semibold ">
      <Link to={'classifiche'} className="hover:bg-accent2 transition duration-150 flex justify-between items-center"><span>{<Rows4 className="w-4 h-4 mr-2"/>}</span>CAMPIONATI</Link>
      <Link className="hover:bg-accent2 transition duration-150 flex justify-between items-center"><span>{<Trophy className="w-4 h-4 mr-2"/>}</span>COPPE</Link>
      <Link className="hover:bg-accent2 transition duration-150 flex justify-between items-center"><span>{<Newspaper className="w-4 h-4 mr-2"/>}</span>NEWS</Link>

      </div>
</div>
  );
}

export default Navbar;


