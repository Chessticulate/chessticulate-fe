
export type NavTab =
  | "profile"
  | "sandbox"
  | "shallowpink"
  | "challenges"
  | "active"
  | "invitations"
  | "completed";

export type GameTab = "play" | "active games";

export type Status = 
  | "move ok"
  | "check"
  | "checkmate"
  | "draw"
  | "insufficient material"
  | "three-fold repetition"
  | "fifty-move rule"

export type TabProps = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
};

export type Color = "white" | "black";

export type ShallowpinkData = {
  fen: string;
  states: Map<number, number>;

  // engine / search
  transpositionTable: Map<bigint, Map<string, number>>;
  moveHistory: string[];
  gameStatus: string;

  // UI
  perspective: Color;
  currentTeam: Color;
  lastOrig: number[];
  lastDest: number[];
};

export const INITIAL_SHALLOWPINK_STATE: ShallowpinkData = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  states: new Map(),

  transpositionTable: new Map(),
  moveHistory: [],
  gameStatus: "",

  perspective: "white",
  currentTeam: "white",
  lastOrig: [],
  lastDest: [],
};


export type UserData = {
  name: string;
  wins: number;
  draws: number;
  losses: number;
};

export type MoveData = {
  id: number;
  user_id: number;
  game_id: number;
  movestr: string;
  fen: string;
};

export type GameData = {
  id: number;
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  whomst: number;
  winner: number;
  fen: string;
  status: string;
  move_hist: string[];
};

export type InvitationData = {
  id: number;
  white_username: string;
  black_username: string;
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

export interface Jwt {
  exp: number;
  user_name: string;
  user_id: number;
}

export type ChallengeData = {
  id: number;
  requester_username: string;
};

