export interface InterestArea {
  id: string;
  name: string;
  fullName: string;
  description: string;
  careers: string[];
  environments: string[];
  color: string;
}

export interface Question {
  id: number;
  areaId: string;
  text: string;
}

export interface Participant {
  id: string;
  name: string;
  date: string;
  rawScores: Record<string, number>; // areaId -> sum of answers (3-15)
  percentiles: Record<string, number>; // areaId -> percentile (0-100)
  answers: Record<number, number>; // questionId -> rating (1-5)
  notes?: string;
}

export type TabType = 'dashboard' | 'spreadsheet' | 'questionnaire' | 'report';
