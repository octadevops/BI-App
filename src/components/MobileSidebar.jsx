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
  HiOutlineChartBarSquare,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { IoExitOutline } from "react-icons/io5";

const MobileSidebar = () => {
  const userName = localStorage.getItem("username");
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFootFallMenuOpen, setIsFootFallMenuOpen] = useState(false);

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

  const toggleFootFallMenu = () => {
    setIsFootFallMenuOpen(!isFootFallMenuOpen);
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
              {/* Dashboard Section */}
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

              {/* Dashboard Sub-Menu */}
              {isDashboardOpen && (
                <div className="ml-10 space-y-1">
                  <Link
                    to="/dashboard/livestock"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlinePresentationChartBar className="text-xl" /> Live
                    Stock
                  </Link>

                  {/* Today Target under Dashboard */}
                  <Link
                    to="/dashboard/sales"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlineChartBarSquare className="text-xl" />
                    Today Target
                  </Link>

                  <Link
                    to="/dashboard/analyzer"
                    className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                  >
                    <HiOutlineCubeTransparent className="text-xl" />
                    Analyzer
                  </Link>

                  <div>
                    <button
                      onClick={toggleFootFallMenu}
                      className="flex gap-2 items-center w-full text-left px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                    >
                      <HiOutlinePresentationChartLine className="text-xl" />
                      Foot Fall
                      {isFootFallMenuOpen ? (
                        <HiOutlineChevronUp className="text-sm" />
                      ) : (
                        <HiOutlineChevronDown className="text-sm" />
                      )}
                    </button>

                    {/* Foot Fall Sub-Menu */}
                    {isFootFallMenuOpen && (
                      <div className="ml-10 space-y-1">
                        <Link
                          to="/dashboard/footfall/hourly"
                          className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                        >
                          <HiOutlineClock className="text-xl" />
                          Hourly Conversion
                        </Link>
                        <Link
                          to="/dashboard/footfall/daily"
                          className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                        >
                          <HiOutlineCalendarDays className="text-xl" />
                          Daily Conversion
                        </Link>
                        <Link
                          to="/dashboard/footfall/weekly"
                          className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                        >
                          <HiOutlineCalendar className="text-xl" />
                          Weekly Conversion
                        </Link>
                        <Link
                          to="/dashboard/footfall/monthly"
                          className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-600"
                        >
                          <HiOutlineCalendar className="text-xl" />
                          Monthly Conversion
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reports Section */}
              <Link
                to={"/reports"}
                className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-700"
              >
                <HiOutlineClipboardDocumentList className="text-xl" /> Reports
              </Link>

              {/* Logout Button */}
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
