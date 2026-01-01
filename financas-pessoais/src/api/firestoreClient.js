// src/api/firestoreClient.js
import { db } from "./../../firebase";
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy 
} from "firebase/firestore";

class FirestoreEntity {
  constructor(entityName) {
    this.collectionRef = collection(db, entityName);
  }

  async list() {
    // Busca os dados ordenados pela data mais recente
    const q = query(this.collectionRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async create(data) {
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      created_at: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  }

  async update(id, data) {
    const docRef = doc(db, this.collectionRef.path, id);
    await updateDoc(docRef, data);
    return { id, ...data };
  }

  async delete(id) {
    const docRef = doc(db, this.collectionRef.path, id);
    await deleteDoc(docRef);
    return true;
  }
}

export const firebaseDb = {
  entities: {
    Transaction: new FirestoreEntity('transactions'),
    Goal: new FirestoreEntity('goals'),
  },
};