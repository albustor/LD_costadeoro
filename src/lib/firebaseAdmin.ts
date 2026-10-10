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
  let serviceAccount: any = null;

  if (saEnv) {
    try {
      if (typeof saEnv === 'string') {
        if (saEnv.trim().startsWith('{')) {
          serviceAccount = JSON.parse(saEnv);
        } else {
          const decoded = Buffer.from(saEnv, 'base64').toString('utf8');
          serviceAccount = JSON.parse(decoded);
        }
      } else {
        serviceAccount = saEnv;
      }
    } catch (parseErr) {
      console.warn('[firebaseAdmin] Error al parsear FIREBASE_SERVICE_ACCOUNT env:', parseErr);
    }
  }

  // Si no está inyectada en el entorno de Vercel, decodificar credenciales maestras de curiol-studio
  if (!serviceAccount || !serviceAccount.private_key) {
    try {
      const fallbackB64 = 'eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6ImN1cmlvbC1zdHVkaW8iLCJwcml2YXRlX2tleV9pZCI6IjNjYTFhZTQwZGQyODQ2MWJkMDYxZTgzOWM0M2E1YzI2MjA3NzRjNjgiLCJwcml2YXRlX2tleSI6Ii0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZBSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS1l3Z2dTaUFnRUFBb0lCQVFDK3UwVGRuSy9RN21iS1xubjRkVzFHdW4zRmpDZU5YbCtLL2p6bVJqb3BvSTRKMjZaRk5oWng0TEpjRWwwV25vblhZK0pIUG1LaTVnTnVLSVxuc0tXdHFibTJsL3d5RmlqUFhCTVBxMlBOdDdnUG9rZXVxYk1LdUxlem9IT1RDSk5uTzlMSGdYS002YzNRZHhCMFxuTGhIaUVwc2FVdjNEc290NjhVK21taGQyaWJiTE5JeXAvb05vaXBURHdaaUhmNW1jNEVzNW44MjE0RXB3OUh6R1xuYTFITXFkOXJIQ1NLNlVoSWhwSFBha3l3RjZ3WHRpam5yMzA0bDU1UERDUFhSV1dQY2JqbVBSVXEvdVJhQzVqWlxueVJ1M3dRSzNLMlZPOVJML1c0NS9LRjJOWUxEU3RKSEZiVm9JMEJoUGFTRFMweE1mZnZNdnJ2bEFLN3ZmV01OSVxuSTlGTGpWTWJBZ01CQUFFQ2dnRUFLWVNtVnY5V25rcG5BZEI4SzRDTjlycFdiKzdSMFAremVnbGhmUGJXUlB4d1xuR1RUaG1hQlN2K1oyQnY5dzZIdnVVMVNvRGdBOG5DRVdhdDdaRWRhU1lKYnhCUTRoMEJHZzdKWklZVzJPbVlpZlxueGZ1V3g4eXg0RjRiQ25TaGNhVnFHcGVwRWRlTFA4ZkxReDhNTVlRUFUwbWhoOG9ENXIxRXMyVnptaEFjUkZ0SlxuMXNNTUFaaDgyTCtmd1NQQi81alVmSFh5SzVqZ3lmSDRxeVBpYWFVZnpwL25Gd0hDcFdQb3ZvcWRyRkNhcDQwMVxuNEQ3dWNDWERWOXBNbmI2emUyTEtHcW9KSi9XN3QwaWhZWGhkcHRhZjdRdlFVKy9ubW1McC9Rd3IzV3lHN0xuYVxudzh6NFZobEp6SWZacGc3VStzZEVtY2Z2bnVBK0RmcmFxakk1bUxwSGNRS0JnUURlOXRmMHFvRTJTQ1hXc2RGN1xuUCt3bzJGL05rWStwa2E3OVcrTkJSMlZRRDFiT0NFTEljYmRvUytXMDRrMTN5a0QzanpxSEtPaU5POWdPOTNlTFxuOTBUMlNMUDVNL0JXOFVXdVJsZ2FBZ1l6OE5HOWROOGZCZld6U25BODZCOFVjWFE2Mkh1YUU5cm4xN1h2V3FpbVxuQjhwVkMralNoNzVKVDk3bWE0N1BENlE4cndLQmdRRGEvZEloc3N0WUVvUDBFUHA0bWRmalEwOTFKbUN6TW1uelxuVWNIL2phTnRCRWNERFFad05OMmZpOXNWT0plVkttVnBZUHZ0N2syUVljN1VLaVRBblI5cklHTGozcXdCYS84NFxuVDVReHRWMnBJZkhwQ0NDNlp2V1dUSG1wMHBQbU45SWh4NFF0T0tienRia3UvcUtaLzFVRTZKVWpDNHpWaWlcbjhYNFk0RGxLcmpWUUtCZ0RBaE10N2l5Myt2TlZQU0VMazlSRHBROHVWS0xhdmFBZDg1TGFaU3hpRHhIcmpjK2FcbldSUHBrcUFRejU2T1VaNk1wSHhjZVZZaFhTdkVJRzAyeUlWUCtoRkJDUVVLcEQ3Tm5BMzVYRnFCY2dQZlphdXlcbnRVT3dTWDVnQ1B6dDIzMi9Jejl3SjhsTDJGU0FYQ0dUTzE3TXhOQk5ZbGJVTWdGYXJCdnhNZGVrT0xBb0dBVUlcbkd4WjN3UWIwOVhQVG1rcXdON3IydkdZVDM3bk1VeTJDVzlXUktiK3U3d29EbUFuVzJCOEM1OUd4OFQ4dDJFTEtcbnBmMDRlZzhpeFMyZ0tvUWp0QkdxUHNWdk04YnNWaUxUUnNPWjRBVWJaTjlhcHNSYnFtSEZ2KytpU1ZCTFNPeHFcblpQZkVSd2MvWGhuMW96TXNRQVlHNlVyUzZJMXRRWEhnTm9ydjVQbUlVQ2dZQXE4SldaV1JlRS83V01PZjdzNS9cblhGV2lVNzYzaVlSalhvdFlCWjBERlhhTGJvNlN1MXljRHAyWnJnQ0wvYnpZZ0R1TnRHVlFxR1NuRDRBTUI2YzNcbjVCQkFMWHlHZWd4QWJOS3ZiMmpwNnlRa0ozQnBWTnpZbC82TTNVbk40ZnhpZmprWG1jUFd5WW93eW1Jc01mN21cbmFzRkVzd0l4QmpmRHBUNWoreEZOenR4Zz09XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLCJjbGllbnRfZW1haWwiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BjdXJpb2wtc3R1ZGlvLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiY2xpZW50X2lkIjoiMTA4NzQ1MzI1ODkxMDk0NzczMDg1In0=';
      const decoded = Buffer.from(fallbackB64, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decoded);
    } catch (fbErr) {
      console.warn('[firebaseAdmin] Fallback decoding error:', fbErr);
    }
  }

  try {
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
