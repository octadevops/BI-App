import React from "react";
import DateTime from "./DateTime";

const GridPanel = ({ children, className = "", title }) => {
  return (
    <div className={`h-full w-full px-1 py-1 bg-slate-200 pb-16 ${className}`}>
      <div className="border border-sky-900 h-full w-full px-6 py-1 rounded-lg">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold py-2">{title}</h1>
          <div>
            <DateTime />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default GridPanel;
