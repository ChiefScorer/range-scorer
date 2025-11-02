import Dexie from 'dexie'

export interface ScoreEntry {
  id: string
  compId: string
  compName: string
  stage: string
  stringNo: number
  points: number
  xCount: number
  penalties: number
  createdAt: number
}

class AppDB extends Dexie {
  // declare the table type manually (no Table import)
  scores: Dexie.Table<ScoreEntry, string>

  constructor() {
    super('range-scorer')
    this.version(1).stores({
      scores: 'id, compId, stage, createdAt'
    })
    this.scores = this.table('scores')
  }
}

export const db = new AppDB()