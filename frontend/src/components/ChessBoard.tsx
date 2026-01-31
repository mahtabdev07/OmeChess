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
  boardSize?: "normal" | "small"; // New Prop
}

interface Piece {
  type: PieceSymbol;
  color: Color;
  square: string;
}

const ChessBoard = ({ 
  fen, 
  color, 
  socket, 
  isPlaying, 
  boardSize = "normal" // Default to normal
}: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const chess = useMemo(() => new Chess(fen), [fen]);
  const board = chess.board();

  const isFlipped = color === "black";
  const displayBoard = isFlipped ? board.slice().reverse() : board;

  // Define size classes based on prop
  const squareSizeClass = boardSize === "small" ? "w-10 h-10 text-[0.6rem]" : "w-19 h-19";
  const markerSizeClass = boardSize === "small" ? "after:w-3 after:h-3" : "after:w-6 after:h-6";

  const getSquareNotation = (row: number, col: number) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
    return files[col] + ranks[row];
  };

  const handleClick = (squareNotation: string, square: Piece | null) => {
    if (!isPlaying) return;
    
    if (!selectedSquare) {
      if (!square) return;

      const isWhitePiece = square.color === "w";
      const isPlayerPiece =
        (color === "white" && isWhitePiece) ||
        (color === "black" && !isWhitePiece);

      if (!isPlayerPiece) return;

      setSelectedSquare(squareNotation);
      const moves = chess.moves({
        square: squareNotation as Square,
        verbose: true,
      });
      setLegalMoves(moves.map((move) => move.to));
      return;
    }
    if (selectedSquare === squareNotation) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (square && square.color === chess.turn()) {
      setSelectedSquare(squareNotation);
      const moves = chess.moves({
        square: squareNotation as Square,
        verbose: true,
      });
      setLegalMoves(moves.map((m) => m.to));
      return;
    }

    socket.emit(MOVE, { from: selectedSquare, to: squareNotation });
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <div className="inline-block border-4 border-[#312E2B] bg-[#d5d6bc] rounded-lg overflow-hidden shadow-2xl">
      {displayBoard.map((row, rowIndex) => {
        const displayRow = isFlipped ? row.slice().reverse() : row;
        return (
          <div key={rowIndex} className="flex">
            {displayRow.map((square, colIndex) => {
              const actualRow = isFlipped ? 7 - rowIndex : rowIndex;
              const actualCol = isFlipped ? 7 - colIndex : colIndex;
              const squareNotation = getSquareNotation(actualRow, actualCol);

              const piece = square ? square.type : null;
              const pieceColor = square ? square.color : null;

              const isLegalMove = legalMoves.includes(squareNotation);

              const getPieceImage = () => {
                if (!piece || !pieceColor) return null;
                const pieceKey =
                  pieceColor === "w"
                    ? piece.toUpperCase()
                    : piece.toLowerCase();
                return PIECES[pieceKey as PieceSymbol];
              };

              const pieceImage = getPieceImage();
              const isDark = (rowIndex + colIndex) % 2 === 1;

              return (
                <div
                  key={colIndex}
                  onClick={() => handleClick(squareNotation, square)}
                  className={`${squareSizeClass} flex select-none transition-none items-center justify-center ${
                    isDark ? "bg-[#739552]" : "bg-[#EBECD0]"
                  } ${
                    piece && isPlaying ? "cursor-grab active:scale-[90%]" : ""
                  } ${
                    isLegalMove
                      ? `after:absolute ${markerSizeClass} after:bg-black after:opacity-20 after:bg-opacity-30 after:rounded-full`
                      : ""
                  }`}
                >
                  {pieceImage && (
                    <img
                      src={pieceImage}
                      alt={`${pieceColor}-${piece}`}
                      className="w-full h-full object-contain pointer-events-none select-none"
                      draggable="false"
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;