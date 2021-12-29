import datetime
import os
import simplejson as json

from decimal import Decimal
from transaction import Transaction
from typing import List

def save_bills(user: str, json_object: list):
  path = "example_jsons/"  # TODO: change this (and in loading.py)
  filepath = os.path.join(path, "bills_" + user + ".json")

  transactions: List[Transaction] = []
  for t in json_object:
    transactions.append(Transaction(
      t["description"],
      datetime.datetime.fromisoformat(t["date"]),
      t["amount"],
      Transaction.Category[t["category"]],
      t["is_monthly"]
    ))

  json.dump(transactions, open(filepath, "w"), use_decimal=True, indent='  ')
