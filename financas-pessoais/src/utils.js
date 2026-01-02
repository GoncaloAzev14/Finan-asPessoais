import { firebaseDb } from "./api/firestoreClient";
import { startOfMonth, endOfMonth, isWithinInterval, format } from "date-fns";

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
  const currentMonthKey = format(today, 'yyyy-MM'); // Ex: "2025-01"

  // 1. Encontrar modelos de transações fixas (os originais marcados como isFixed)
  const fixedModels = transactions.filter(t => t.isFixed === true);

  console.log(`🔍 Encontrados ${fixedModels.length} modelos de despesas fixas`);

  for (const model of fixedModels) {
    // 2. Criar uma chave única para identificar a transação recorrente deste mês
    const recurringKey = `${model.id}_${currentMonthKey}`;
    
    // 3. Verificar se já existe uma transação gerada para este modelo NESTE mês
    const alreadyExists = transactions.find(t => 
      t.recurringKey === recurringKey || // Verifica pela chave única
      (
        t.recurringSourceId === model.id && // OU verifica se veio deste modelo
        t.isGenerated === true && 
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
      )
    );

    if (alreadyExists) {
      console.log(`✅ Despesa fixa "${model.description}" já existe neste mês`);
      continue; // Pula para o próximo modelo
    }

    // 4. Criar a transação para o mês atual
    console.log(`➕ Gerando despesa fixa: "${model.description}" para ${currentMonthKey}`);
    
    try {
      await firebaseDb.entities.Transaction.create({
        description: model.description,
        amount: model.amount,
        type: model.type,
        category: model.category,
        date: today.toISOString(),
        isFixed: false,
        isGenerated: true,
        recurringSourceId: model.id,
        recurringKey: recurringKey
      });
      console.log(`✅ Despesa fixa "${model.description}" criada com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao gerar despesa fixa "${model.description}":`, error);
    }
  }
};