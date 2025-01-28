import { Dispatch, SetStateAction } from "react";

// tabs
export type Tab = "play" | "active" | "completed";

// user types
export type UserData = {
  name: string;
  wins: number;
  draws: number;
  losses: number;
};

export type Move = {
  id: number;
  user_id: number;
  game_id: number;
  movestr: string;
  fen: string;
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

export type InvitationsWindowProps = {
  currentGame: GameData | null;
  moveHist: string[];
};

// chessboard types
// could probably merge these two
export type ChessboardProps = {
  game: GameData | null;
  moveHist: string[];
  setMoveHist: Dispatch<SetStateAction<string[]>>;
};

export type GamesWindowProps = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  currentGame: GameData | null;
  setCurrentGame: Dispatch<SetStateAction<GameData | null>>;
  moveHist: string[];
  setMoveHist: Dispatch<SetStateAction<string[]>>;
};

export type Square = {
  notation: string;
  x: number;
  y: number;
};

export type TabProps = {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
};

export type LoginSignupError = {
  show: boolean;
  message: string;
};

export type MoveHistoryProps = {
  moves: string[];
};
