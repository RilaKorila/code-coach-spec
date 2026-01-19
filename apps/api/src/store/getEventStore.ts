import { getFirestore } from '../infra/firestore.js';
import { MemoryEventStore } from './memoryEventStore.js';
import { FirestoreEventStore } from './firestoreEventStore.js';
import type { EventStore } from './eventStore.js';

let store: EventStore | null = null;

/**
 * Default: use Firestore when available; fall back to memory to avoid blocking local dev.
 * - If you want to force memory: EVENT_STORE=memory
 * - If you want to force firestore: EVENT_STORE=firestore (will throw if Firestore init fails)
 */
export function getEventStore(): EventStore {
  if (store) return store;

  // Tests should not depend on external services (Firestore/gRPC).
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    store = new MemoryEventStore();
    return store;
  }

  const mode = process.env.EVENT_STORE ?? 'auto';
  if (mode === 'memory') {
    store = new MemoryEventStore();
    return store;
  }

  if (mode === 'firestore') {
    store = new FirestoreEventStore(getFirestore());
    return store;
  }

  // auto
  try {
    store = new FirestoreEventStore(getFirestore());
    return store;
  } catch {
    store = new MemoryEventStore();
    return store;
  }
}


