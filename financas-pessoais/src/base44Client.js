// src/api/base44Client.js
const BASE_URL = 'https://api.base44.com/v1';

class Base44Entity {
  constructor(entityName) {
    this.entityName = entityName;
  }

  async list(orderBy = '-created_date', limit = 100) {
    try {
      const response = await fetch(
        `${BASE_URL}/entities/${this.entityName}?order_by=${orderBy}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${this.entityName}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error(`Error listing ${this.entityName}:`, error);
      return [];
    }
  }

  async create(data) {
    try {
      const response = await fetch(
        `${BASE_URL}/entities/${this.entityName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to create ${this.entityName}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error creating ${this.entityName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(
        `${BASE_URL}/entities/${this.entityName}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to update ${this.entityName}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${this.entityName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(
        `${BASE_URL}/entities/${this.entityName}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to delete ${this.entityName}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.entityName}:`, error);
      throw error;
    }
  }
}

export const base44 = {
  entities: {
    Transaction: new Base44Entity('Transaction'),
    Goal: new Base44Entity('Goal'),
  },
};