"use client";

import { useSocket } from "@/hooks/useSocket";
import {
  ERROR,
  GAME_OVER,
  GAME_STARTED,
  INIT_GAME,
  MOVE_MADE,
  OPPONENT_LEFT,
  WAITING,
} from "@/utils/messages";
import { useEffect, useState } from "react";

type GameState = "menu" | "waiting" | "playing" | "gameOver";
type Color = "white" | "black" | null;

const useGame = () => {
  const { socket, isConnected } = useSocket();
  const [gameState, setGameState] = useState<GameState>("menu");
  const [color, setColor] = useState<Color>(null);
  const [fen, setFen] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [gameResult, setGameResult] = useState<string>("");
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.connect();

    socket.on(
      GAME_STARTED,
      (data: {
        color: string;
        opponent: string;
        fen: string;
        moves: string[];
      }) => {
        console.log("Game started", data);
        setGameState("playing");
        setColor(data.color as Color);
        setFen(data.fen);
        setMoves(data.moves || []);
      },
    );

    socket.on(WAITING, () => {
      console.log("Waiting for opponent...");
      setGameState("waiting");
    });

    socket.on(MOVE_MADE, (data: any) => {
      console.log("Move made:", data);
      setFen(data.fen);
      setMoves(data.moves || []);
    });

    socket.on(GAME_OVER, (data: any) => {
      console.log("Game over:", data);
      setGameState("gameOver");
      setMoves(data.moves || []);
      if (data.winner === "draw") {
        setGameResult("Game Draw!");
      } else {
        setGameResult(`${data.winner} wins!`);
      }
    });

    socket.on(OPPONENT_LEFT, () => {
      console.log("Opponent left");
      setGameState("gameOver");
      setGameResult("Opponent left the game");
    });

    return () => {
      socket.off(GAME_STARTED);
      socket.off(WAITING);
      socket.off(MOVE_MADE);
      socket.off(GAME_OVER);
      socket.off(OPPONENT_LEFT);
      socket.off(ERROR);
      socket.disconnect();
    };
  }, [socket]);

  const handlePlayOnline = () => {
    if (!isConnected) {
      alert("Connecting to server… please wait");
      return;
    }

    socket.emit("init_game");
  };

  return {
    gameState,
    color,
    fen,
    gameResult,
    moves,
    handlePlayOnline,
    socket,
    isConnected
  };
};

export default useGame;
