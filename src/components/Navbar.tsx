import React from "react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-gray-900/80 backdrop-blur-md fixed w-full top-0 z-10">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-600">
        FLAP
      </h1>
    </header>
  );
};

export default Navbar;
