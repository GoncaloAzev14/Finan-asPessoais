import { firebaseDb } from "./api/firestoreClient";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function createPageUrl(pageName) {
    const routes = {
      'Dashboard': '/',
      'Transactions': '/transactions',
      'Goals': '/goals',
    };
    
    return routes[pageName] || '/';
  }
  
  export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }

export const checkAndGenerateRecurring = async (transactions) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // 1. Encontrar modelos de transações fixas
  const fixedModels = transactions.filter(t => t.isFixed);

  for (const model of fixedModels) {
    // 2. Verificar se já existe uma cópia desta transação neste mês
    const alreadyExists = transactions.find(t => 
      t.description === model.description && 
      !t.isFixed && // As cópias geradas não são "modelos" isFixed para não duplicarem infinitamente
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    if (!alreadyExists) {
      // 3. Criar a transação para o mês atual
      await firebaseDb.entities.Transaction.create({
        description: model.description,
        amount: model.amount,
        type: model.type,
        category: model.category,
        date: today.toISOString(),
        isFixed: false, // Esta é a instância paga do mês
        isGenerated: true // Flag para saberes que foi o sistema que criou
      });
    }
  }
};