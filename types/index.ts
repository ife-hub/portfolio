export interface Todo {
  id: number;
  title: string;
  subtitle: string;
  done: boolean;
}

export interface Ritual {
  label: string;
  completed: number;
  total: number;
}

export interface RankEntry {
  rank: number;
  name: string;
  points: string;
  isYou?: boolean;
  initials?: string;
  color: string;
}

export interface PartnerInfo {
  name: string;
  initials: string;
  syncedAgo: string;
  message: string;
}

export interface MilestoneInfo {
  label: string;
  emoji: string;
  percentAchieved: number;
}