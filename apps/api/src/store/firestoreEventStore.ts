import type { Firestore } from '@google-cloud/firestore';

import type { StoredEvent } from '../policy/rawData.js';
import type { EventStore } from './eventStore.js';

export class FirestoreEventStore implements EventStore {
  constructor(
    private readonly firestore: Firestore,
    private readonly collectionName: string = 'events',
  ) {}

  async put(event: StoredEvent): Promise<void> {
    await this.firestore.collection(this.collectionName).doc(event.eventId).set(event, { merge: false });
  }
}


