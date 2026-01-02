import { firebaseDb } from "./api/firestoreClient";
import { 
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isWithinInterval,
  format
} from "date-fns";

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

  // 1. Encontrar modelos de transações recorrentes (marcados com isFixed e uma periodicidade válida)
  const recurringModels = transactions.filter(t => t.isFixed === true && t.periodicity && t.periodicity !== "none");

  for (const model of recurringModels) {
    let interval;
    let periodKey;

    // 2. Definir o intervalo de verificação baseado na periodicidade escolhida no formulário
    if (model.periodicity === "monthly") {
      interval = { start: startOfMonth(today), end: endOfMonth(today) };
      periodKey = format(today, 'yyyy-MM');
    } else if (model.periodicity === "weekly") {
      interval = { start: startOfWeek(today), end: endOfWeek(today) };
      periodKey = format(today, 'yyyy-II'); // ISO week number
    } else if (model.periodicity === "daily") {
      interval = { start: startOfDay(today), end: endOfDay(today) };
      periodKey = format(today, 'yyyy-MM-dd');
    } else {
      continue; // Pula se a periodicidade não for reconhecida
    }

    const recurringKey = `${model.id}_${periodKey}`;
    
    // 3. Verificar se já existe uma transação para este período específico
    const alreadyExists = transactions.find(t => 
      t.recurringKey === recurringKey || // Verifica pela chave única deste período
      (
        // Verifica se o modelo original foi criado dentro do intervalo atual
        t.id === model.id && 
        isWithinInterval(new Date(t.date), interval)
      ) ||
      (
        // Verifica se já existe uma transação gerada para este modelo neste intervalo
        t.recurringSourceId === model.id && 
        isWithinInterval(new Date(t.date), interval)
      )
    );

    if (alreadyExists) {
      continue; // Pula para o próximo modelo se já estiver preenchido
    }

    // 4. Criar a nova transação automática para o período atual
    try {
      await firebaseDb.entities.Transaction.create({
        description: model.description,
        amount: model.amount,
        type: model.type,
        category: model.category,
        date: today.toISOString(),
        isFixed: false, // A cópia gerada não deve ser um "modelo" gerador
        isGenerated: true,
        recurringSourceId: model.id,
        recurringKey: recurringKey,
        periodicity: "none"
      });
    } catch (error) {
      console.error(`Erro ao gerar transação recorrente "${model.description}":`, error);
    }
  }
};