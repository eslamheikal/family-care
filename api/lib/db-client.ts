import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.join(__dirname, '..', 'family-care-firebase-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const DbClient = admin.firestore();
