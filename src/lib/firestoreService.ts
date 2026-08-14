import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { CategoryBudget, Transaction, UserProfile } from '../types';
import { initialCategories, initialTransactions } from '../data/initialData';

export const saveUserProfileToFirestore = async (
  uid: string,
  profile: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
  }
};

export const fetchUserDataFromFirestore = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    // Fetch Categories
    const categoriesRef = collection(db, 'users', uid, 'categories');
    const categoriesSnap = await getDocs(categoriesRef);
    let categories: CategoryBudget[] = [];
    if (!categoriesSnap.empty) {
      categories = categoriesSnap.docs.map((d) => d.data() as CategoryBudget);
    }

    // Fetch Transactions
    const txRef = collection(db, 'users', uid, 'transactions');
    const txSnap = await getDocs(txRef);
    let transactions: Transaction[] = [];
    if (!txSnap.empty) {
      transactions = txSnap.docs.map((d) => d.data() as Transaction);
      // Sort newest first
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // If new user with no categories, initialize with default categories & transactions
    if (categories.length === 0) {
      const batch = writeBatch(db);
      initialCategories.forEach((cat) => {
        const catDoc = doc(db, 'users', uid, 'categories', cat.id);
        batch.set(catDoc, cat);
      });
      initialTransactions.forEach((tx) => {
        const tDoc = doc(db, 'users', uid, 'transactions', tx.id);
        batch.set(tDoc, tx);
      });
      await batch.commit();
      categories = [...initialCategories];
      transactions = [...initialTransactions];
    }

    const profile = userSnap.exists() ? (userSnap.data() as UserProfile) : null;

    return {
      profile,
      categories,
      transactions,
    };
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export const saveTransactionToFirestore = async (
  uid: string,
  tx: Transaction
) => {
  try {
    const txRef = doc(db, 'users', uid, 'transactions', tx.id);
    await setDoc(txRef, tx);
  } catch (error) {
    console.error('Error saving transaction to Firestore:', error);
  }
};

export const deleteTransactionFromFirestore = async (
  uid: string,
  txId: string
) => {
  try {
    const txRef = doc(db, 'users', uid, 'transactions', txId);
    await deleteDoc(txRef);
  } catch (error) {
    console.error('Error deleting transaction from Firestore:', error);
  }
};

export const saveCategoriesToFirestore = async (
  uid: string,
  categories: CategoryBudget[]
) => {
  try {
    const batch = writeBatch(db);
    categories.forEach((cat) => {
      const catDoc = doc(db, 'users', uid, 'categories', cat.id);
      batch.set(catDoc, cat);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error saving categories to Firestore:', error);
  }
};
