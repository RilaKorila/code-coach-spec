import { Firestore } from '@google-cloud/firestore';

let firestore: Firestore | null = null;

export function getFirestore(): Firestore {
  if (firestore) return firestore;
  firestore = new Firestore();
  return firestore;
}


