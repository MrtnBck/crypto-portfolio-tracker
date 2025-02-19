import { Link } from "react-router-dom";

export default function MainNavigation() {
  return (
    <nav className="flex justify-between px-2 py-2 bg-green-800 text-white">
      <Link to={"/"} className="mr-4">
        Logo
      </Link>
      <div className="flex">
        <Link to={"/new"} className="mr-4">
          Add Coin
        </Link>
        <Link to={"/portfolio"}>Portfolio</Link>
      </div>
    </nav>
  );
}
