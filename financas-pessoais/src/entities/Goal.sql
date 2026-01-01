{
    "name": "Goal",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Nome da meta"
      },
      "target_amount": {
        "type": "number",
        "description": "Valor alvo"
      },
      "current_amount": {
        "type": "number",
        "description": "Valor atual economizado"
      },
      "deadline": {
        "type": "string",
        "format": "date",
        "description": "Data limite"
      },
      "icon": {
        "type": "string",
        "description": "\u00cdcone da meta"
      }
    },
    "required": [
      "name",
      "target_amount"
    ]
  }