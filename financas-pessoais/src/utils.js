import { firebaseDb } from "./api/firestoreClient";
import { 
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  startOfDay, endOfDay,
  isWithinInterval, format
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
    
    // Find "model" transactions where the user enabled recurrence
    const recurringModels = transactions.filter(t => t.isFixed === true);
  
    for (const model of recurringModels) {
      let interval;
      let periodKey;
  
      // Define time window based on the chosen periodicity
      if (model.periodicity === "monthly") {
        interval = { start: startOfMonth(today), end: endOfMonth(today) };
        periodKey = format(today, 'yyyy-MM');
      } else if (model.periodicity === "weekly") {
        interval = { start: startOfWeek(today), end: endOfWeek(today) };
        periodKey = format(today, 'yyyy-II'); // Year-Week number
      } else if (model.periodicity === "daily") {
        interval = { start: startOfDay(today), end: endOfDay(today) };
        periodKey = format(today, 'yyyy-MM-dd');
      }
  
      const recurringKey = `${model.id}_${periodKey}`;
      
      // Check if a transaction for this period already exists
      const alreadyExists = transactions.find(t => 
        t.recurringKey === recurringKey || 
        (t.id === model.id && isWithinInterval(new Date(t.date), interval)) ||
        (t.recurringSourceId === model.id && isWithinInterval(new Date(t.date), interval))
      );
  
      if (alreadyExists) continue;
  
      try {
        await firebaseDb.entities.Transaction.create({
          ...model,
          id: undefined, // Let Firebase create a new ID
          date: today.toISOString(),
          isFixed: false, // The copy is not a generator
          isGenerated: true,
          recurringSourceId: model.id,
          recurringKey: recurringKey
        });
      } catch (error) {
        console.error("Error generating recurring transaction:", error);
      }
    }
  };