import { Chess } from "chess.js";
import { Socket } from "socket.io";

export class Game {
  public player1: Socket;
  public player2: Socket;
  public moves: string[];
  private board: Chess;
  private startTime: Date;
  private gameOver: boolean;
  public winner: "white" | "black" | "draw" | null;

  constructor(player1: Socket, player2: Socket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
    this.gameOver = false;
    this.winner = null;
  }

  makeMove(socket: Socket, move: { from: string; to: string }) {
    if (this.gameOver) {
      return { success: false, message: "Game already over" };
    }
    if (this.board.turn() === "w" && socket !== this.player1) {
      return { success: false, message: "Not your turn" };
    }
    if (this.board.turn() === "b" && socket !== this.player2) {
      return { success: false, message: "Not your turn" };
    }
    try {
      const result = this.board.move(move);

      if (!result) {
        return { success: false, message: "Invalid move" };
      }
      this.moves.push(result.san);

      const isCheck = this.board.inCheck();
      const isCheckmate = this.board.isCheckmate();
      const isDraw = this.board.isDraw();
      const isStalemate = this.board.isStalemate();
      const isThreefold = this.board.isThreefoldRepetition();
      const isGameOver = this.board.isGameOver();

      if (isGameOver) {
        this.gameOver = true;
        if (isCheckmate) {
          this.winner = this.board.turn() === "w" ? "black" : "white";
        } else {
          this.winner = "draw";
        }
      }

      return {
        success: true,
        move: result,
        fen: this.board.fen(),
        isGameOver,
        isCheck,
        isCheckmate,
        isDraw,
        isStalemate,
        isThreefold,
        winner: this.winner,
      };
    } catch (error) {
      return { success: false, message: "Invalid move" };
    }
  }

  getBoard() {
    return this.board.fen();
  }

  getMoves() {
    return this.moves;
  }
}
