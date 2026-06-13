// Pure sim types — NO Phaser/DOM imports anywhere in src/game/systems/.

export interface StatBlock {
  maxSpeed: number; acceleration: number; gripFactor: number; turnRate: number;
  boostPower: number; boostDuration: number; mass: number;
  /** wall collision speed retention multiplier; modified by structure comps */
  wallPenalty?: number;
}

export interface ShipState {
  x: number; y: number; heading: number; vx: number; vy: number;
  boostRemaining: number; lap: number; nextCheckpoint: number; finishedAtTick: number | null;
}

/** Per-tick input bitmask: 1=up 2=down 4=left 8=right 16=boost */
export type InputTick = number;
export type InputTrace = InputTick[];

export interface RaceResult {
  finishOrder: number[];        // ship indices
  timesMs: number[];            // per ship, finish time
  stateHash: string;            // FNV-1a periodic hash — determinism proof
}
