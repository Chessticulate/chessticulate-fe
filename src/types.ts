
export type NavTab =
  | "profile"
  | "sandbox"
  | "shallowpink"
  | "challenges"
  | "active"
  | "invitations"
  | "completed";

export type GameTab = "play" | "active games";

export type GameMode = "pvp" | "shallowpink" | "sandbox";

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
  mode: string;
  fen: string;
  states: Map<number, number>;

  // engine / search
  table: Map<bigint, Map<string, number>>;
  move_hist: string[];
  status: string;

  // UI
  // looks redundant, but perspective and currentTeam are separately maintained
  perspective: Color;
  currentTeam: Color;

  // I would like to consolidate theses fields too,
  // but neither of these are returned by the api
  // lastOrig: number[];
  // lastDest: number[];
};

export const InitShallowpinkState = (): ShallowpinkData => ({
  mode: "shallowpink",
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  states: new Map(),
  table: new Map(),
  move_hist: [],
  status: "",
  perspective: "white",
  currentTeam: "white",
});

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
  mode: string;

  id: number;
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  perspective: Color;
  whomst: number;
  winner: number;
  fen: string;
  states: Map<number, number>;
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

