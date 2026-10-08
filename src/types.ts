export type Status = 'Active' | 'In Bargaining' | 'Ratified' | 'Expired';

export type Industry =
  | 'Aviation'
  | 'Cleaning'
  | 'Manufacturing'
  | 'Health'
  | 'Public & Commercial';

export type Region = 'Auckland' | 'Wellington' | 'Christchurch' | 'National';

export interface Agreement {
  id: string;
  employerName: string;
  industry: Industry;
  region: Region;
  ceaExpiryDate: string;
  status: Status;
  leadOrganiser: string;
  leadEmail: string;
  estimatedMembers: number;
  notes: string;
  dateLastUpdated: string;
}
