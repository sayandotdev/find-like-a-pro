import { Github, UserStar } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative py-8 px-4 text-center bg-gray-900/80 flex items-center justify-center gap-2 z-10">
      <p className="text-gray-400">&copy; 2025 NoteVibe. All rights reserved</p>{" "}
      |{" "}
      <div className="flex items-center justify-center">
        <Link
          href={"https://github.com/sayandotdev/find-like-a-pro"}
          target="_blank"
          className="hover:text-pink-400 transition-colors mx-1"
          rel="noreferrer noopener"
        >
          <Github size={18} />
        </Link>
        <Link
          href={"https://sayanrakshit.vercel.app"}
          target="_blank"
          className="hover:text-pink-400 transition-colors mx-1"
          rel="noreferrer noopener"
        >
          <UserStar size={18} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
