import type { Server as IOServer } from "socket.io";
import { Socket } from "socket.io";
import { Game } from "./Game.js";
import {
  ANALYTICS_UPDATE,
  GAME_OVER,
  GAME_STARTED,
  INIT_GAME,
  MOVE,
  MOVE_MADE,
  OPPONENT_LEFT,
  WAITING,
} from "./messages.js";

export class GameManager {
  private games: Game[];
  private pendingUser: Socket | null;
  private users: Socket[];
  private totalGamesPlayed: number;

  constructor(private io: IOServer) {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
    this.totalGamesPlayed = 0;
  }
  private emitAnalytics() {
    this.io.emit(ANALYTICS_UPDATE, this.getAnalytics());
  }

  addUser(socket: Socket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: Socket) {
    this.users = this.users.filter((s) => s.id !== socket.id);

    this.games = this.games.filter((game) => {
      if (game.player1 === socket || game.player2 === socket) {
        const opponent = game.player1 === socket ? game.player2 : game.player1;
        
        if (opponent) {
          opponent.emit(OPPONENT_LEFT);
        }
        return false; // remove game
      }
      return true;
    });
    this.emitAnalytics();
    
    if (this.pendingUser?.id === socket.id) {
      this.pendingUser = null;
    }
  }

  private addHandler(socket: Socket) {
    socket.on(INIT_GAME, () => this.handleInitGame(socket));
    socket.on(MOVE, (move) => this.handleMove(socket, move));
  }

  private handleInitGame(socket: Socket) {
    // we already have someone waiting → start game
    if (this.pendingUser && this.pendingUser !== socket) {
      const game = new Game(this.pendingUser, socket);
      this.games.push(game);
      this.totalGamesPlayed++;
      this.emitAnalytics();

      // White = the one who waited first
      this.pendingUser.emit(GAME_STARTED, {
        color: "white",
        opponent: socket.id,
        fen: game.getBoard(),
        moves: [],
      });

      // Black = the new player
      socket.emit(GAME_STARTED, {
        color: "black",
        opponent: this.pendingUser.id,
        fen: game.getBoard(),
        moves: [],
      });

      console.log(
        "Game started between",
        this.pendingUser.id,
        "and",
        socket.id,
      );

      this.pendingUser = null;
      return;
    }

    this.pendingUser = socket;
    socket.emit(WAITING);
  }

  private handleMove(socket: Socket, move: { from: string; to: string }) {
    const game = this.games.find(
      (g) => g.player1 === socket || g.player2 === socket,
    );

    if (!game) return;

    const result = game.makeMove(socket, move);

    if (!result.success) {
      return;
    }

    const opponent = game.player1 === socket ? game.player2 : game.player1;

    if (result.isGameOver) {
      socket.emit(GAME_OVER, result);
      opponent.emit(GAME_OVER, result);

      console.log("Game over, winner:", result.winner);

      // remove game from list
      this.games = this.games.filter((g) => g !== game);
      this.emitAnalytics();
      return;
    }

    const moves = game.getMoves();

    // Normal move → emit to both players
    socket.emit(MOVE_MADE, { ...result, moves });
    opponent.emit(MOVE_MADE, { ...result, moves });
    this.emitAnalytics();
  }

  public getAnalytics() {
    return {
      totalGames: this.totalGamesPlayed,
      totalPlaying: this.games.length * 2,
    };
  }
}
