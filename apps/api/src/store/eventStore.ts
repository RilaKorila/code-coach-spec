import type { StoredEvent } from '../policy/rawData.js';

export interface EventStore {
    put(event: StoredEvent): Promise<void>;
}
