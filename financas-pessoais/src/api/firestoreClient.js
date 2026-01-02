import { db } from "./../../firebase";
import { auth } from "./../../firebase";
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where 
} from "firebase/firestore";

class FirestoreEntity {
  constructor(entityName) {
    this.entityName = entityName;
    this.collectionRef = collection(db, entityName);
  }

  async list() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("Usuário não autenticado");
      return [];
    }

    try {
      const q = query(
        this.collectionRef, 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenar DEPOIS de recuperar os dados
      return docs.sort((a, b) => {
        const dateA = new Date(a.date || a.created_at);
        const dateB = new Date(b.date || b.created_at);
        return dateB - dateA; // Ordem decrescente (mais recente primeiro)
      });
    } catch (error) {
      console.error("Erro ao listar documentos:", error);
      throw error;
    }
  }

  async create(data) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("Utilizador não autenticado");
    }

    try {
      // Garantir que a data existe
      const docData = {
        ...data,
        userId,
        created_at: new Date().toISOString(),
        // Se não houver campo 'date', usar created_at
        date: data.date || new Date().toISOString()
      };

      const docRef = await addDoc(this.collectionRef, docData);
      return { id: docRef.id, ...docData };
    } catch (error) {
      console.error("Erro ao criar documento:", error);
      throw error;
    }
  }
  
  async update(id, data) {
    try {
      const docRef = doc(db, this.entityName, id);
      await updateDoc(docRef, data);
      return { id, ...data };
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, this.entityName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      throw error;
    }
  }
}

export const firebaseDb = {
  entities: {
    Transaction: new FirestoreEntity('transactions'),
    Goal: new FirestoreEntity('goals'),
  },
};