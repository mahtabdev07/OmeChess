"use client";
import Button from "@/components/Button";
import ChessBoard from "@/components/ChessBoard";
import useGame from "@/hooks/useGame";

const Play = () => {
  const {
    gameState,
    color,
    fen,
    gameResult,
    moves,
    handlePlayOnline,
    socket,
    isConnected,
  } = useGame();

  return (
    <div className="bg-[#302E2B] min-h-screen text-white flex flex-col items-center">
      <section
        className="
          grid grid-cols-1 lg:grid-cols-2 
          items-center 
          max-w-7xl w-full 
          px-4 mt-14
          gap-8 lg:gap-0
          lg:ml-20
        "
      >
        {/* Chess Board */}
        <div className="flex items-center justify-center w-full">
          <ChessBoard
            fen={fen}
            socket={socket}
            color={color || "white"}
            isPlaying={gameState === "playing"}
          />
        </div>

        {/* Sidebar */}
        <div
          className="
            flex flex-col items-center 
            w-full max-w-sm 
            bg-[#262522] 
            rounded-lg shadow-lg
            mx-auto
            lg:ml-18
            h-auto lg:h-[calc(100vh-120px)]
          "
        >
          <header className="font-bold text-3xl flex items-center justify-center gap-3 bg-[#21201D] py-4 w-full rounded-t-lg">
            <img src="/play.svg" alt="play" className="w-8" />
            Play Chess
          </header>

          <section className="px-4 py-5 w-full">
            {gameState === "menu" && (
              <Button disabled={!isConnected} onClick={handlePlayOnline}>
                Find Match
              </Button>
            )}

            {gameState === "waiting" && (
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                <p className="text-lg">Waiting for opponent...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Finding a player for you
                </p>
              </div>
            )}

            {gameState === "playing" && (
              <div className="rounded-lg max-h-64 overflow-y-auto">
                <p className="text-lg font-semibold mb-2 pb-1 border-b border-zinc-100/10">
                  Moves
                </p>

                {moves.length === 0 ? (
                  <p className="text-sm text-zinc-400">No moves yet</p>
                ) : (
                  <div className="space-y-1">
                    {moves.map((move, index) => {
                      if (index % 2 === 0) {
                        return (
                          <div key={index} className="flex items-center gap-10 text-md">
                            <span className="text-gray-400 w-8">
                              {Math.floor(index / 2) + 1}.
                            </span>
                            <span className="font-mono text-white/70 font-semibold">
                              {move}
                            </span>
                            {moves[index + 1] && (
                              <span className="font-mono text-white/70">
                                {moves[index + 1]}
                              </span>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            )}

            {gameState === "gameOver" && (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold">{gameResult}</p>
                <Button disabled={!isConnected} onClick={handlePlayOnline}>
                  Play Again
                </Button>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
};

export default Play;
