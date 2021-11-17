from decimal import Decimal
from transaction import Transaction
from typing import List
import json

def generate_graph(transactions: List[Transaction]):
  categories = {c.name: Decimal("0") for c in Transaction.Category}
  for t in transactions:
    if t.amount <= Decimal("0"):
      categories[t.category.name] += Decimal("-1") * t.amount
  categories = {k: str(v) for k, v in categories.items()}
  return json.dumps(categories)

if __name__ == "__main__":
  from loading import load
  import sys
  print(generate_graph(load(sys.argv[1])))