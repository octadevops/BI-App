import React, { useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";

const Card = ({ children, className = "", title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`border border-sky-600 rounded-lg w-full p-3 bg-sky-300 bg-opacity-15 ${className}`}
    >
      {/* Button to toggle collapse */}
      <button
        className="w-full flex justify-between items-center transition-all duration-500"
        onClick={toggleCollapse}
      >
        <h2 className="font-semibold text-xl pb-2">{title}</h2>

        {isCollapsed ? (
          <HiOutlineChevronUp className="text-xl transition-transform duration-500" />
        ) : (
          <HiOutlineChevronDown className="text-xl transition-transform duration-500" />
        )}
      </button>

      {/* Horizontal line */}
      <hr
        className={`border-b border-sky-600 my-2 transition-all duration-500 ${
          isCollapsed ? "opacity-100" : "opacity-0 hidden"
        }`}
      />

      {/* Collapsible content with animation */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isCollapsed ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`${isCollapsed ? "block" : "hidden"}`}>{children}</div>
      </div>
    </div>
  );
};

export default Card;
