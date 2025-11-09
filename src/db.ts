import Dexie from 'dexie'

export interface ScoreEntry {
  id: string
  compId: string        // link to Competitor.id
  compName: string      // snapshot for fast export
  stage: string
  stringNo: number
  points: number
  xCount: number
  penalties: number
  createdAt: number
}

export interface Competitor {
  id: string
  compNo: number        // auto-incremented integer (1,2,3…)
  name: string
  division?: string
  category?: string
  team?: string
  createdAt: number
}

class AppDB extends Dexie {
  scores: Dexie.Table<ScoreEntry, string>
  competitors: Dexie.Table<Competitor, string>

  constructor() {
    super('range-scorer')

    // v1: scores only
    this.version(1).stores({
      scores: 'id, compId, stage, createdAt'
    })

    // v2: add competitors table
    this.version(2).stores({
      scores: 'id, compId, stage, createdAt',
      competitors: 'id, compNo, name, createdAt'
    })

    this.scores = this.table('scores')
    this.competitors = this.table('competitors')
  }
}

export const db = new AppDB()

// Utility: next available competitor number (1,2,3…)
export async function getNextCompNo(): Promise<number> {
  const last = await db.competitors.orderBy('compNo').last()
  return (last?.compNo ?? 0) + 1
}

// Create and return a new competitor (auto-numbered)
export async function addCompetitor(input: {
  name: string
  division?: string
  category?: string
  team?: string
}): Promise<Competitor> {
  const compNo = await getNextCompNo()
  const id = crypto.randomUUID()
  const c: Competitor = {
    id,
    compNo,
    name: input.name.trim(),
    division: input.division?.trim() || undefined,
    category: input.category?.trim() || undefined,
    team: input.team?.trim() || undefined,
    createdAt: Date.now()
  }
  await db.competitors.add(c)
  return c
}

export type { ScoreEntry as TScoreEntry, Competitor as TCompetitor }