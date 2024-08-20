import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/NLM LOGO.png";
import { IoExitOutline } from "react-icons/io5";

const MobileSidebar = () => {
  const userName = localStorage.getItem("username");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 1000);
  };
  return (
    <div className="md:hidden z-50">
      <div className="fixed top-0 right-0 p-4 ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
        >
          {isOpen ? (
            <AiOutlineClose className="block h-6 w-6" />
          ) : (
            <AiOutlineMenu className="block h-6 w-6" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex flex-col w-64 bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 shadow-md">
              <div className="flex items-center z-50">
                <Link to="/" smooth={true} duration={500}>
                  <img className="w-32" src={Logo} alt="Logo" />
                </Link>
              </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a
                href="#home"
                className="block px-4 py-2 text-sm font-medium rounded hover:bg-gray-700"
              >
                Home
              </a>
              <a
                href="#stocktake"
                className="block px-4 py-2 text-sm font-medium rounded hover:bg-gray-700"
              >
                Stock Take
              </a>
              <a
                href="#reports"
                className="block px-4 py-2 text-sm font-medium rounded hover:bg-gray-700"
              >
                Reports
              </a>
              {userName && (
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-gray-700 flex items-center gap-2 px-4 py-2 rounded-md font-medium duration-300 mb-4 md:hidden "
                >
                  Logout
                  <IoExitOutline className="text-white text-xl" />
                </button>
              )}
            </nav>
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default MobileSidebar;
