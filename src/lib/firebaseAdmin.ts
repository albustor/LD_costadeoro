import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';

let firestoreInstance: Firestore | null = null;
let firebaseAppInstance: any = null;

/**
 * Inicializa y retorna la instancia de Firestore para el backend (Node.js/Next.js)
 * Proyecto oficial: curiol-studio
 */
export function getFirestoreDb(): Firestore | null {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const saEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!saEnv) {
    console.warn('[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT no está configurada en las variables de entorno.');
    return null;
  }

  try {
    let serviceAccount: any;
    if (typeof saEnv === 'string') {
      // Soportar string JSON directo o base64
      if (saEnv.trim().startsWith('{')) {
        serviceAccount = JSON.parse(saEnv);
      } else {
        const decoded = Buffer.from(saEnv, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
      }
    } else {
      serviceAccount = saEnv;
    }

    if (!getApps().length) {
      firebaseAppInstance = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'curiol-studio',
      });
    } else {
      firebaseAppInstance = getApps()[0];
    }

    firestoreInstance = getFirestore(firebaseAppInstance);
    return firestoreInstance;
  } catch (error: any) {
    console.error('[firebaseAdmin Init Error]:', error.message);
    return null;
  }
}

export { FieldValue };
