"use client";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { ANALYTICS_UPDATE } from "@/utils/messages";

const useRealtimeAnalytics = () => {
  const [totalGames, setTotalGames] = useState(0);
  const [totalPlaying, setTotalPlaying] = useState(0);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); 
    }

    const handler = (data: { totalGames: number; totalPlaying: number }) => {
      setTotalGames(data.totalGames);
      setTotalPlaying(data.totalPlaying);
    };

    socket.on(ANALYTICS_UPDATE, handler);

    return () => {
      socket.off(ANALYTICS_UPDATE, handler);
    };
  }, []);

  return { totalGames, totalPlaying };
};

export default useRealtimeAnalytics;
