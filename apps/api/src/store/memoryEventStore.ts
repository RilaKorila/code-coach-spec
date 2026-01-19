import type { StoredEvent } from '../policy/rawData.js';
import type { EventStore } from './eventStore.js';

export class MemoryEventStore implements EventStore {
  // For local/dev only. Not exposed via any endpoint.
  private events: StoredEvent[] = [];

  async put(event: StoredEvent): Promise<void> {
    this.events.push(event);
  }
}


