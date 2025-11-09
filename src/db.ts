import Dexie from 'dexie'
import type { DivisionName, EventName, GradeName, GenderCat, AgeCat, CompetitionCat } from './constants/meta'

export interface ScoreEntry {
  id: string
  entryId: string          // links to Entry.id (competitor–division)
  event: EventName         // Plates/Barricade/Practical/ Mover
  stringNo: number
  points: number
  xCount: number
  penalties: number
  createdAt: number
}

// A person
export interface Competitor {
  id: string
  compNo: number           // sequential number (1,2,3…)
  name: string
  gender?: GenderCat
  ageCat?: AgeCat
  compCat?: CompetitionCat // Civilian/Service/LE
  createdAt: number
}

// A specific gun/division entry for that person
export interface Entry {
  id: string
  competitorId: string
  division: DivisionName
  grade?: GradeName
  // cached display fields for convenience
  compNo: number
  name: string
  createdAt: number
}

class AppDB extends Dexie {
  scores: Dexie.Table<ScoreEntry, string>
  competitors: Dexie.Table<Competitor, string>
  entries: Dexie.Table<Entry, string>

  constructor() {
    super('range-scorer')

    // v1 (legacy): scores
    this.version(1).stores({
      scores: 'id, createdAt'
    })

    // v2: + competitors
    this.version(2).stores({
      scores: 'id, entryId, event, createdAt',
      competitors: 'id, compNo, name, createdAt'
    })

    // v3: + entries (competitor–division)
    this.version(3).stores({
      scores: 'id, entryId, event, createdAt',
      competitors: 'id, compNo, name, createdAt',
      entries: 'id, competitorId, division, createdAt'
    })

    this.scores = this.table('scores')
    this.competitors = this.table('competitors')
    this.entries = this.table('entries')
  }
}

export const db = new AppDB()

// Utilities
export async function getNextCompNo(): Promise<number> {
  const last = await db.competitors.orderBy('compNo').last()
  return (last?.compNo ?? 0) + 1
}

export async function addCompetitor(input: {
  name: string
  gender?: GenderCat
  ageCat?: AgeCat
  compCat?: CompetitionCat
}): Promise<Competitor> {
  const compNo = await getNextCompNo()
  const c: Competitor = {
    id: crypto.randomUUID(),
    compNo,
    name: input.name.trim(),
    gender: input.gender,
    ageCat: input.ageCat,
    compCat: input.compCat,
    createdAt: Date.now()
  }
  await db.competitors.add(c)
  return c
}

// Create competitor–division entry (prevents duplicate same division for same competitor)
export async function addEntry(input: {
  competitor: Competitor
  division: DivisionName
  grade?: GradeName
}): Promise<Entry> {
  const exists = await db.entries.where({ competitorId: input.competitor.id }).toArray()
  if (exists.some(e => e.division === input.division)) {
    throw new Error('This competitor already has an entry for that division.')
  }
  const e: Entry = {
    id: crypto.randomUUID(),
    competitorId: input.competitor.id,
    division: input.division,
    grade: input.grade,
    compNo: input.competitor.compNo,
    name: input.competitor.name,
    createdAt: Date.now()
  }
  await db.entries.add(e)
  return e
}

export type { ScoreEntry as TScoreEntry, Competitor as TCompetitor, Entry as TEntry }