export type ThreatType = 'scam' | 'qr' | 'misinfo' | 'cyberbully' | 'deepfake';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Region = 'central' | 'north' | 'northeast' | 'east' | 'west';

export interface AnonymousIncident {
  id: string;
  threat_type: ThreatType;
  threat_label: string;
  region: Region;
  neighborhood: string;
  severity: Severity;
  time_ago: string;
  report_count: number;
  description: string;
}

export interface RegionCounts {
  central: number;
  north: number;
  northeast: number;
  east: number;
  west: number;
}

export interface TypeCounts {
  all: number;
  scam: number;
  qr: number;
  misinfo: number;
  cyberbully: number;
  deepfake: number;
}

export interface HeatmapStats {
  total_reports: number;
  reports_today: number;
  people_protected: number;
  active_threats: number;
}

export interface HeatmapResponse {
  stats: HeatmapStats;
  by_type: TypeCounts;
  by_region: RegionCounts;
  recent: AnonymousIncident[];
  last_updated: string;
}
