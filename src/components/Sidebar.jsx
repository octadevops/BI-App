import { Link } from "react-router-dom";
import Logo from "../assets/NLM LOGO.png";
import { useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClipboardDocumentList,
  HiOutlineCubeTransparent,
  HiOutlinePresentationChartBar,
  HiOutlinePresentationChartLine,
  HiOutlineQrCode,
  HiOutlineUserGroup,
  HiOutlineShoppingCart,
  HiOutlineChartBarSquare,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineCalendar,
} from "react-icons/hi2";

const Sidebar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFootFallMenuOpen, setIsFootFallMenuOpen] = useState(false);

  const toggleDashboardMenu = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  const toggleFootFallMenu = () => {
    setIsFootFallMenuOpen(!isFootFallMenuOpen);
  };

  return (
    <div className="h-screen hidden md:flex flex-col w-60 bg-gray-800 text-white sticky top-0 z-50">
      <div className="flex items-center justify-center h-16 shadow-md">
        <div className="flex items-center">
          <Link to="/" smooth={true} duration={500}>
            <img className="w-36" src={Logo} alt="Logo" />
          </Link>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Dashboard Section */}
        <div>
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
                <HiOutlinePresentationChartBar className="text-xl" /> Live Stock
              </Link>

              {/* Live Sales Dropdown under Dashboard */}
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
                {isFootFallMenuOpen && (
                  <div className="ml-6 space-y-1">
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
        </div>

        {/* Reports Section */}
        <Link
          to={"/reports"}
          className="flex gap-2 items-center px-4 py-2 text-sm font-normal rounded hover:bg-gray-700"
        >
          <HiOutlineClipboardDocumentList className="text-xl" /> Reports
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
