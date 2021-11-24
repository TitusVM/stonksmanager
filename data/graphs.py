from decimal import Decimal
from transaction import Transaction
from typing import List

def generate_graph(transactions: List[Transaction]):
  categories = {c.name: Decimal("0") for c in Transaction.Category}
  for t in transactions:
    if t.amount <= Decimal("0"):
      categories[t.category.name] += Decimal("-1") * t.amount
  return categories