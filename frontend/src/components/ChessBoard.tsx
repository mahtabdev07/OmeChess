"use client";

import { MOVE } from "@/utils/messages";
import { PIECES } from "@/utils/pieces";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useMemo, useState } from "react";
import { Socket } from "socket.io-client";

interface ChessBoardProps {
  fen: string;
  color: "white" | "black";
  socket: Socket;
  isPlaying?: boolean;
}

interface Piece {
  type: PieceSymbol;
  color: Color;
  square: string;
}

const ChessBoard = ({ fen, color, socket, isPlaying }: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const chess = useMemo(() => new Chess(fen), [fen]);
  const board = chess.board();

  const isFlipped = color === "black";
  const displayBoard = isFlipped ? board.slice().reverse() : board;

  const getSquareNotation = (row: number, col: number) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
    return files[col] + ranks[row];
  };

  const handleClick = (squareNotation: string, square: Piece | null) => {
    if (!isPlaying) return;

    if (!selectedSquare) {
      if (!square) return;

      const isPlayerPiece =
        (color === "white" && square.color === "w") ||
        (color === "black" && square.color === "b");

      if (!isPlayerPiece) return;

      setSelectedSquare(squareNotation);
      const moves = chess.moves({
        square: squareNotation as Square,
        verbose: true,
      });
      setLegalMoves(moves.map((m) => m.to));
      return;
    }

    if (selectedSquare === squareNotation) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    socket.emit(MOVE, { from: selectedSquare, to: squareNotation });
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <div className="flex justify-center items-center w-full">
      {/* Responsive board container */}
      <div
        className="aspect-square"
        style={{
          width: "min(90vw, 90vh, 608px)", // 🔥 magic line
        }}
      >
        <div className="grid grid-rows-8 grid-cols-8 w-full h-full border-4 border-[#312E2B] bg-[#d5d6bc] rounded-lg shadow-2xl overflow-hidden">
          {displayBoard.map((row, rowIndex) => {
            const displayRow = isFlipped ? row.slice().reverse() : row;

            return displayRow.map((square, colIndex) => {
              const actualRow = isFlipped ? 7 - rowIndex : rowIndex;
              const actualCol = isFlipped ? 7 - colIndex : colIndex;
              const squareNotation = getSquareNotation(actualRow, actualCol);

              const isDark = (rowIndex + colIndex) % 2 === 1;
              const isLegalMove = legalMoves.includes(squareNotation);

              const pieceImage =
                square &&
                PIECES[
                  (square.color === "w"
                    ? square.type.toUpperCase()
                    : square.type.toLowerCase()) as PieceSymbol
                ];

              return (
                <div
                  key={squareNotation}
                  onClick={() => handleClick(squareNotation, square)}
                  className={`relative flex items-center justify-center select-none ${
                    isDark ? "bg-[#739552]" : "bg-[#EBECD0]"
                  } ${
                    square && isPlaying
                      ? "cursor-grab active:scale-[90%]"
                      : ""
                  } ${
                    isLegalMove
                      ? "after:absolute after:w-1/4 after:h-1/4 after:rounded-full after:bg-black after:opacity-25"
                      : ""
                  }`}
                >
                  {pieceImage && (
                    <img
                      src={pieceImage}
                      alt="piece"
                      className="w-full h-full object-contain pointer-events-none select-none"
                      draggable={false}
                    />
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
