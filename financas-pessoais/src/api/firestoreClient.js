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
        // Nota: Não usamos orderBy aqui para evitar a necessidade de criar índices manuais no Firebase console
      );
      
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // ORDENAÇÃO NO CLIENTE (Mais recente primeiro)
      return docs.sort((a, b) => {
        // Prioridade para o campo 'date', fallback para 'created_at'
        const timeA = new Date(a.date || a.created_at || 0).getTime();
        const timeB = new Date(b.date || b.created_at || 0).getTime();
        
        return timeB - timeA; // B - A garante a ordem decrescente (mais recente no topo)
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
    Category: new FirestoreEntity('categories'),
  },

  async clearAllUserData() {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const collections = ['transactions', 'goals', 'categories'];
    
    for (const colName of collections) {
      const q = query(collection(db, colName), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, colName, document.id)));
      await Promise.all(deletePromises);
    }
  }
};