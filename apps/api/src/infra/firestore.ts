import { Firestore } from '@google-cloud/firestore';

let firestore: Firestore | null = null;

export function getFirestore(): Firestore {
  if (firestore) return firestore;
  firestore = new Firestore({
    // We commonly build objects with optional fields; Firestore rejects explicit `undefined`.
    ignoreUndefinedProperties: true,
  });
  return firestore;
}


