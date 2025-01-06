// user types
export type UserData = {
  name: string;
  wins: number;
  draws: number;
  losses: number;
};

// game types
export type GameData = {
  id: number;
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  whomst: number;
  winner: number;
  fen: string;
};

export type GameRowProps = {
  game: GameData;
  active: boolean;
  onForfeit: (gameId: number) => void;
  onPlay: (gameId: number) => void;
};

// invitation types
export type InvitationData = {
  id: number;
  white_username: string;
  black_username: string;
};

export type InvitationProps = {
  type: string;
  invitation: InvitationData;
  onAnswer: (invitationId: number) => void;
  onCancel: (invitationId: number) => void;
};

// chessboard types
// could probably merge these two
export type ChessboardProps = {
  game: GameData | null;
};

export type GamesWindowProps = {
  game: GameData | null;
  // need to have event handler here instead of setState
  // something like onGameSelect
};

export type Square = {
  notation: string;
  x: number;
  y: number;
};

export type LoginSignupError = {
  show: boolean;
  message: string;
};

export type MoveHistoryProps = {
  moves: string[]; 
};
