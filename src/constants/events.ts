export const EVENTS = ['Practical', 'Barricade', 'Mover', 'Plates'] as const
export type EventName = typeof EVENTS[number]