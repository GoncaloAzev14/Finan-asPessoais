import { db } from "./../../firebase";
import { auth } from "./../../firebase";
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where 
} from "firebase/firestore";

class FirestoreEntity {
  constructor(entityName) {
    this.entityName = entityName;
    this.collectionRef = collection(db, entityName);
  }

  async list() {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    // FILTRO: Apenas documentos onde userId corresponde ao utilizador atual
    const q = query(
      this.collectionRef, 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async create(data) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Utilizador não autenticado");

    const docRef = await addDoc(this.collectionRef, {
      ...data,
      userId, // Gravar o ID do utilizador no documento
      created_at: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  }
  
  // Update e Delete devem verificar permissões (Regras do Firebase tratam disto)
  async update(id, data) {
    const docRef = doc(db, this.entityName, id);
    await updateDoc(docRef, data);
    return { id, ...data };
  }

  async delete(id) {
    const docRef = doc(db, this.entityName, id);
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