{
    "name": "Transaction",
    "type": "object",
    "properties": {
      "description": {
        "type": "string",
        "description": "Descri\u00e7\u00e3o da transa\u00e7\u00e3o"
      },
      "amount": {
        "type": "number",
        "description": "Valor da transa\u00e7\u00e3o"
      },
      "type": {
        "type": "string",
        "enum": [
          "income",
          "expense"
        ],
        "description": "Tipo: receita ou despesa"
      },
      "category": {
        "type": "string",
        "enum": [
          "salary",
          "freelance",
          "investments",
          "food",
          "transport",
          "housing",
          "utilities",
          "health",
          "education",
          "entertainment",
          "shopping",
          "travel",
          "other"
        ],
        "description": "Categoria da transa\u00e7\u00e3o"
      },
      "date": {
        "type": "string",
        "format": "date",
        "description": "Data da transa\u00e7\u00e3o"
      }
    },
    "required": [
      "description",
      "amount",
      "type",
      "category",
      "date"
    ]
  }