
export interface Market {
  name: string;
  description: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  customBet: Market[];
  probability: number;
  insight: string;
}

export interface PredictionSlip {
  id: string;
  date: string;
  matches: Match[];
  averageProbability: number;
  groundingSources?: { title: string; uri: string }[];
}

export interface BettingAppState {
  currentSlip: PredictionSlip | null;
  loading: boolean;
  error: string | null;
  selectedDate: string;
}
