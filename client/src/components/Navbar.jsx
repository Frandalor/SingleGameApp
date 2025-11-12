import { Link } from 'react-router-dom';
import { Rows4, Trophy, Newspaper } from 'lucide-react';
function Navbar() {
  return (
    <div className="navbar relative z-20 mb-8 bg-base-100 shadow-sm md:px-[10%] lg:px-[20%]">
      <div className="flex flex-1 justify-around font-semibold md:justify-normal md:gap-8 [&>a]:rounded-md [&>a]:bg-accent1 [&>a]:px-4 [&>a]:py-2">
        <Link
          to={'classifiche'}
          className="flex items-center justify-between transition duration-150 hover:bg-accent2"
        >
          <span>{<Rows4 className="mr-2 h-4 w-4" />}</span>CAMPIONATI
        </Link>
        <Link className="flex items-center justify-between transition duration-150 hover:bg-accent2">
          <span>{<Trophy className="mr-2 h-4 w-4" />}</span>COPPE
        </Link>
        <Link className="flex items-center justify-between transition duration-150 hover:bg-accent2">
          <span>{<Newspaper className="mr-2 h-4 w-4" />}</span>NEWS
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
