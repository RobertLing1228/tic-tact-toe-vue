//PLAYER
type Player = {
    name: string;
    symbol: string;
    isBot: boolean;
};

//GAME
type Square = {
    row: number;
    col: number;
    symbol: string;
    highlight?: boolean;
};

type Board = Square[];

type Score = {
    Winner: Player | null;
    NumberOfMoves: number;
};

type Scores = Score[];

type Game = {
    board: Board;
    scoreboard: Scores;
    currentPlayer: Player;
    winner: Player | null;
    isDraw: boolean;
    isOver: boolean;
    botPlayer: Player;
    botBoard: Board;
    botMoves: Square[];
    botLastMove: Square | null;
};

export type { Player, Square, Board, Game };