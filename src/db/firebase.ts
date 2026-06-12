import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  collection,
  query,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Reservation, Order, Review } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Critical connection test constraint
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 1. Create a table reservation
export async function createReservation(resData: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const reservationId = 'RES-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const path = `reservations/${reservationId}`;
  
  const reservation: Reservation = {
    ...resData,
    id: reservationId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'reservations', reservationId);
    await setDoc(docRef, reservation);
    return reservationId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 2. Fetch a single table reservation by ID
export async function getReservation(reservationId: string): Promise<Reservation | null> {
  const path = `reservations/${reservationId}`;
  try {
    const docRef = doc(db, 'reservations', reservationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Reservation;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// 3. Create a Takeaway Order
export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const path = `orders/${orderId}`;
  
  const order: Order = {
    ...orderData,
    id: orderId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, order);
    return orderId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 4. Fetch a single order by ID
export async function getOrder(orderId: string): Promise<Order | null> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Order;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// 5. Setup live listener to order status changes
export function subscribeToOrder(orderId: string, callback: (order: Order | null) => void, onError?: (err: any) => void) {
  const path = `orders/${orderId}`;
  const docRef = doc(db, 'orders', orderId);
  return onSnapshot(docRef, 
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Order);
      } else {
        callback(null);
      }
    },
    (err) => {
      if (onError) {
        onError(err);
      } else {
        handleFirestoreError(err, OperationType.GET, path);
      }
    }
  );
}

// 6. Setup live listener to reservation status changes
export function subscribeToReservation(reservationId: string, callback: (res: Reservation | null) => void, onError?: (err: any) => void) {
  const path = `reservations/${reservationId}`;
  const docRef = doc(db, 'reservations', reservationId);
  return onSnapshot(docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Reservation);
      } else {
        callback(null);
      }
    },
    (err) => {
      if (onError) {
        onError(err);
      } else {
        handleFirestoreError(err, OperationType.GET, path);
      }
    }
  );
}

// 7. Simulate step changes so users can test their tracking in the iframe
export async function simulateOrderFulfillment(orderId: string, nextStatus: Order['status']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status: nextStatus });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function simulateReservationFulfillment(reservationId: string, nextStatus: Reservation['status']): Promise<void> {
  const path = `reservations/${reservationId}`;
  try {
    const docRef = doc(db, 'reservations', reservationId);
    await updateDoc(docRef, { status: nextStatus });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// 8. Create a customer review
export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  const reviewId = 'REV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const path = `reviews/${reviewId}`;
  
  const review: Review = {
    ...reviewData,
    id: reviewId,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'reviews', reviewId);
    await setDoc(docRef, review);
    return reviewId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 9. Subscribe to all customer reviews
export function subscribeToReviews(callback: (reviews: Review[]) => void, onError?: (err: any) => void) {
  const path = 'reviews';
  const collectionRef = collection(db, 'reviews');
  // Avoid query-level orderby to bypass any potential indexing limits or security constraints
  const q = query(collectionRef);
  
  return onSnapshot(q,
    (snapshot) => {
      const reviewsList: Review[] = [];
      snapshot.forEach((docSnap) => {
        reviewsList.push(docSnap.data() as Review);
      });
      // Sort in-memory descending by createdAt
      reviewsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(reviewsList);
    },
    (err) => {
      if (onError) {
        onError(err);
      } else {
        handleFirestoreError(err, OperationType.GET, path);
      }
    }
  );
}

// 10. Simulate owner response to a review
export async function simulateReviewReply(reviewId: string, replyText: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    const docRef = doc(db, 'reviews', reviewId);
    await updateDoc(docRef, { ownerResponse: replyText });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}
