import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const db = getFirestore();

export const addItem = async (itemData) => {
  const itemsRef = collection(db, 'items');
  await addDoc(itemsRef, itemData);
};

export const getItems = async (userId) => {
  const itemsRef = collection(db, 'items');
  const q = query(itemsRef, where('ownerId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const removeItem = async (itemId) => {
  const itemRef = doc(db, 'items', itemId);
  await deleteDoc(itemRef);
};
