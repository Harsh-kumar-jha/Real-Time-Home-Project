import React from "react";
import { useLocation, useNavigate } from "react-router";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathMathRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  return (
    <div className="bg-white border-b shadow-sm static top-0 z-10">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://thumb.housinganywhere.com/img/logo-1200x630.png"
            className="h-20 cursor-pointer"
            alt="logo"
            onClick={() => navigate("/about")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute("/") && "text-black border-b-red-600"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute("/about") && "text-black border-b-red-600"
              }`}
              onClick={() => navigate("/about")}
            >
              About
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute("/offers") && "text-black border-b-red-600"
              }`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                pathMathRoute("/sign-in") && "text-black border-b-red-600"
              }`}
              onClick={() => navigate("/sign-in")}
            >
              Sign-In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
