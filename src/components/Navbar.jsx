import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    setUsername(user || "");
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 1000);
  };
  const navItems = [
    // { id: 1, text: "Home", path: "/" },
    // { id: 2, text: "Stock Take", path: "/stocktake" },
    //{ id: 1, text: "Reports", path: "/reports" },
  ];
  return (
    <nav className="bg-gray-800 font-Inter sticky top-0 w-full shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex md:justify-between md:w-full md:items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* <Link to="/" smooth={true} duration={500}>
                <img className="w-36" src={Logo} alt="Logo" />
              </Link> */}
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {isLoggedIn && (
                <div className="flex items-center">
                  <span className="text-white flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium">
                    Welcome, {username}
                  </span>
                </div>
              )}

              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.text}
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    window.location.reload();
                  }}
                  className="text-white hover:bg-gray-700 flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium duration-300 "
                >
                  Logout
                  <HiOutlineArrowRightStartOnRectangle className="text-white text-xl" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
