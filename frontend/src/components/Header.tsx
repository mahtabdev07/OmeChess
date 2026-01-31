"use client";

import useRealtimeAnalytics from "@/hooks/useRealtimeAnalytics";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FiLinkedin } from "react-icons/fi";

const Header = () => {
  const { totalGames, totalPlaying } = useRealtimeAnalytics();

  return (
    <header className="w-full px-4 py-2">
      <div className="flex items-center justify-between max-w-8xl mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Image
            src="/chessLogo.png"
            alt="Chess Logo"
            width={150}
            height={48}
            className="w-36"
          />
        </div>

        {/* Center: Analytics */}
        <div className="hidden sm:flex items-center gap-7 text-center">
          <p className="font-light text-sm md:text-base">
            <span className="font-extrabold text-xl md:text-2xl mr-1">
              {totalPlaying}
            </span>
            PLAYING NOW
          </p>
          <p className="font-light text-sm md:text-base">
            <span className="font-extrabold text-xl md:text-2xl mr-1">
              {totalGames}
            </span>
            GAMES TODAY
          </p>
        </div>

        {/* Right: Socials */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/mohdmahtab07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <FiLinkedin className="w-8 h-8" />
          </a>

          <a
            href="https://github.com/mahtabdev07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <FaGithub className="w-8 h-8" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
