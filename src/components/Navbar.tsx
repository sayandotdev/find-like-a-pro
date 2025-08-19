import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md fixed w-full z-10">
      <Link href={"/"}>
        <Image
          src={"/flap.png"}
          height={50}
          width={50}
          alt="FLAP"
          className="ml-8 w-26 h-20 cursor-pointer"
        />
      </Link>
    </header>
  );
};

export default Navbar;
