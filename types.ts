export interface GardenPreferences {
  style: string;
  climate: string;
  size: string;
  sunlight: string;
  notes: string;
}

export interface GeneratedPlan {
  title: string;
  description: string;
  plantRecommendations: string[];
  maintenanceTips: string[];
}

export enum AppState {
  INPUT = 'INPUT',
  PLANNING = 'PLANNING',
  VISUALIZING = 'VISUALIZING',
}
