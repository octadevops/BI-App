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
} from "react-icons/hi2";

const Sidebar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const toggleDashboardMenu = () => {
    setIsDashboardOpen(!isDashboardOpen);
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
        </div>

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
