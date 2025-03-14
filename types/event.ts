export interface Event {
  id: string;
  title: string;
  host_at: string;
  max_players: number;
  host_by?: {
    _id: string;
    username: string;
  };
  attendees?: Array<{
    _id: string;
    username: string;
  }>;
  place?: {
    Name: string;
    Address: string;
  };
  is_vote: boolean;
  is_game_addable: boolean;
}

export interface Game {
  _id: string;
  game_id: string;
  add_by: string;
  game: {
    name: string;
    thumbnail?: string;
    image?: string;
    description?: string;
    min_player?: number;
    max_player?: number;
    bgg_id?: string;
    year_published?: number;
    rating?: number;
    users_rated?: number;
  };
  vote_by?: Array<{
    email: string;
    is_interested: boolean;
  }>;
}

export interface VoteResponse {
  success: boolean;
  message?: string;
}