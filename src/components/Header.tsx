import React from "react";

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-medium text-gray-900">
            Marketing Montage
          </h1>
          <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
            Beta
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Help
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
