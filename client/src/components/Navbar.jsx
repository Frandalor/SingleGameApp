import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm relative z-20">
  <div className="flex-1">
    <Link to={'/'} className="btn btn-ghost text-xl">SingleGame</Link>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li><a>Link</a></li>
      <li>
        <details>
          <summary>Classifiche</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
             <li><Link to={'/serie-a'}>Serie A</Link></li>
             <li><Link to={'/serie-b'}>Serie B</Link></li>
             <li><Link to={'/serie-a'}>Serie C</Link></li>
             <li><Link to={'/serie-a'}>Serie D</Link></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>
  );
}

export default Navbar;


