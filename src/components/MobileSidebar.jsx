import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/NLM LOGO.png";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClipboardDocumentList,
  HiOutlineCubeTransparent,
  HiOutlinePresentationChartBar,
  HiOutlinePresentationChartLine,
  HiOutlineQrCode,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { IoExitOutline } from "react-icons/io5";

const MobileSidebar = () => {
  const userName = localStorage.getItem("username");
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 1000);
  };

  const toggleDashboardMenu = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  return (
    <div className="md:hidden z-50">
      <div className="fixed top-0 right-0 p-4">
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
              <button
                onClick={toggleDashboardMenu}
                className="flex gap-2 items-center w-full text-left px-4 py-2 text-sm font-normal rounded hover:bg-gray-700"
              >
                <HiOutlineQrCode className="text-xl" /> Dashboard
                {isDashboardOpen ? (
                  <HiOutlineChevronUp className="text-sm" />
                ) : (
                  <HiOutlineChevronDown className="text-sm" />
                )}
              </button>
              {isDashboardOpen && (
                <div className="ml-10 space-y-1">
                  <Link
                    to="/dashboard/livestock"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlinePresentationChartBar className="text-xl" /> Live
                    Stock
                  </Link>
                  <Link
                    to="/dashboard/sales"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlinePresentationChartLine className="text-xl" />
                    Live Sales
                  </Link>
                  <Link
                    to="/dashboard/analyzer"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlineCubeTransparent className="text-xl" />
                    Analyzer
                  </Link>
                  <Link
                    to="/dashboard/footfall"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlineUserGroup className="text-xl" />
                    Foot Fall Analyzer
                  </Link>
                </div>
              )}

              <Link
                to={"/reports"}
                className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-700"
              >
                <HiOutlineClipboardDocumentList className="text-xl" /> Reports
              </Link>

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
