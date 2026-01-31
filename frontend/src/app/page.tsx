"use client";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="bg-[#302E2B] min-h-screen text-white flex flex-col items-center">
      <Header />

      <section className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 items-center max-w-7xl w-full px-4">
        <div className="flex justify-center">
          <img
            src="/chessboard-animation.gif"
            alt="chess-bg"
            className="w-full max-w-lg md:max-w-xl"
          />
        </div>
        <article className="flex flex-col space-y-8 sm:space-y-10 w-full max-w-lg mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold flex flex-col gap-3 sm:gap-5 items-center font-poppins">
            Play Chess Online
            <span className="text-xl font-semibold sm:font-extrabold sm:text-4xl text-[#E0E0DF] w-full max-w-sm font-inter">
              Just like she played with you 😂
            </span>
          </h1>
          <Button onClick={() => router.push("/start")}>
            Get Started
          </Button>
        </article>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-start max-w-7xl w-full px-4 mt-16 md:mt-7">
        <article className="flex flex-col space-y-10 w-full max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold  flex flex-col sm:items-start items-center gap-5 font-poppins">
            Improve Your Game with Lessons
            <span className="text-xl text-[#E0E0DF] w-full max-w-md font-inter font-semibold">
              Learn with quick, fun lessons designed for players of all levels.
            </span>
          </h1>
          <button className="hidden md:block bg-[#3D3B38] text-xl text-[#d7d7d7] font-bold cursor-pointer py-3 px-4 rounded-lg shadow-[#3D3B38] shadow-[0_4px_0_#333]/60 w-full max-w-sm active:scale-[99%] transition duration-100 hover:bg-[#3f3d3b]">
            Start a Lesson
          </button>
        </article>
        <div className="flex justify-center">
          <img
            src="/chess-bg2.webp"
            alt="chess-bg"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>
      </section>

      <section className="mb-32 grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-start max-w-7xl w-full px-4 mt-16 md:mt-7">
        <div className="flex justify-center">
          <img
            src="/chess-bg3.webp"
            alt="chess-bg"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>
        <article className="flex flex-col space-y-10 w-full max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold  flex flex-col sm:items-start items-center gap-5 font-poppins">
            Play Chess Bots
            <span className="text-xl text-[#E0E0DF] w-full max-w-md font-inter font-semibold">
              Play against unique chess personalities ranging in skill and playstyle.
            </span>
          </h1>
          <button className="hidden md:block bg-[#3D3B38] text-xl text-[#d7d7d7] font-bold cursor-pointer py-3 px-4 rounded-lg shadow-[#3D3B38] shadow-[0_4px_0_#333]/60 w-full max-w-sm active:scale-[99%] transition duration-100 hover:bg-[#3f3d3b]">
            Challenge a Bot
          </button>
        </article>
      </section>
    </div>
  );
};

export default HomePage;
