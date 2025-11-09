export const EVENTS = ['Plates', 'Barricade', 'Practical', 'Mover'] as const
export type EventName = typeof EVENTS[number]

export const DIVISIONS = [
  'Open','Metallic','Production','Production Optic',
  'Rimfire Open','Rimfire Metallic','Rimfire Production','Rimfire Production Optic'
] as const
export type DivisionName = typeof DIVISIONS[number]

// Grades
export const GRADES = ['High Master','Master','Expert','Sharpshooter','Marksman'] as const
export type GradeName = typeof GRADES[number]

// Competitor categories
export type GenderCat = 'Man' | 'Woman'
export type AgeCat = 'Junior' | 'Senior' | 'Grand Senior'
export type CompetitionCat = 'Civilian' | 'Service' | 'Law Enforcement'