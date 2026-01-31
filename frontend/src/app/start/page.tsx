"use client";

import { useRouter } from "next/navigation";
import Guide from "@/components/Guide";

const StartPage = () => {
  const router = useRouter();

  return (
    <div className="bg-[#302E2B] min-h-screen text-white flex flex-col items-center justify-center sm:px-4 overflow-hidden relative">
      {/* Guide overlay */}
      <Guide
        message="Hey there! I'm Coach David. I'm here to help you get started. Choose how you want to play!"
        imageSrc="/coach-david.png"
      />

      <div className="max-w-xl w-full rounded-xl p-4 sm:p-8 flex flex-col gap-1 sm:gap-5 text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-poppins">
          How do you want to continue?
        </h1>

        <p className="text-zinc-300 text-md sm:text-lg font-inter">
          Choose the experience that fits you best.
        </p>

        <div className="flex flex-col gap-4 sm:gap-6 mt-6">
          <button
            onClick={() => router.push("/play")}
            className="bg-[#81B64C] cursor-pointer text-2xl sm:text-3xl font-bold py-4 rounded-lg shadow-[0_4px_0_#457522] w-full active:scale-[99%] active:shadow-none translate-y-0 active:translate-y-1 transition-all duration-100 hover:bg-[#8bc552]"
          >
            Play Online
          </button>
          {/* Play Online */}
          <button
            disabled
            className="group relative flex flex-col items-center justify-center bg-[#3D3B38] cursor-not-allowed text-2xl sm:text-3xl font-bold py-5 rounded-lg shadow-[0_4px_0_#262522] w-full transition-all"
          >
            <span className="opacity-40">Play with Friend</span>

            {/* The Professional Badge */}
            <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-[#262522] text-amber-500 rounded border border-amber-500/30">
              In Development
            </span>
          </button>

          {/* Play Against Bot */}
          <button
            disabled
            className="group relative flex flex-col items-center justify-center bg-[#3D3B38] cursor-not-allowed text-2xl sm:text-3xl font-bold py-5 rounded-lg shadow-[0_4px_0_#262522] w-full transition-all"
          >
            <span className="opacity-40">Play Against Bot</span>

            {/* The Professional Badge */}
            <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-[#262522] text-amber-500 rounded border border-amber-500/30">
              In Development
            </span>
          </button>

          {/* Coming soon note */}
          <p className="text-sm sm:text-base text-zinc-400">
            🚧 Online and Friend modes will be coming soon…
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
