// src/api/storageClient.js
const STORAGE_KEY_PREFIX = 'financas_pessoais_';

class LocalEntity {
  constructor(entityName) {
    this.key = STORAGE_KEY_PREFIX + entityName;
  }

  // Obter todos os itens
  async list() {
    const data = localStorage.getItem(this.key);
    const items = data ? JSON.parse(data) : [];
    // Ordenar por data decrescente (mais recente primeiro)
    return items.sort((a, b) => new Date(b.date || b.created_date) - new Date(a.date || a.created_date));
  }

  async create(data) {
    const items = await this.list();
    const newItem = {
      ...data,
      id: crypto.randomUUID(), // Gera um ID único
      created_date: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(this.key, JSON.stringify(items));
    return newItem;
  }

  async update(id, data) {
    let items = await this.list();
    items = items.map(item => item.id === id ? { ...item, ...data } : item);
    localStorage.setItem(this.key, JSON.stringify(items));
    return data;
  }

  async delete(id) {
    let items = await this.list();
    items = items.filter(item => item.id !== id);
    localStorage.setItem(this.key, JSON.stringify(items));
    return true;
  }
}

export const db = {
  entities: {
    Transaction: new LocalEntity('transactions'),
    Goal: new LocalEntity('goals'),
  },
};