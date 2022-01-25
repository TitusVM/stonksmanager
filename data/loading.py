import os
import simplejson as json

from datetime import datetime
from decimal import Decimal
from transaction import Transaction
from typing import List


HOUSING_KEYWORDS = ["immo", "estate", "loyer", "landi", "conforama", "ikea", "lipo", "otto", "swisscom", "sunrise", "upc", "video", "tele", "comm", "wingo", "yallo", "salt", "lyca", "lebara"]
FOOD_KEYWORDS = ["migros", "coop", "denner", "lidl", "aldi", "manor", "globus", "aligro", "volg", "spar", "avec", "kiosk", "selecta", "boulan", "restaurant", "marche", "marché"]
TRANSPORTATION_KEYWORDS = ["gas", "essence", "voiture", "cff", "bls", "tancomat", "aer", "air", "swiss", "easyjet", "navig", "train", "avion", "station"]
LEISURE_KEYWORDS = ["digitec", "galaxus", "jumbo", "decathlon", "fnac", "dosenbach", "vogel", "payot", "mediamarkt", "media markt", "magasin", "cinema", "musee", "musée", "théâtre", "theatre"]
NECESSITIES_KEYWORDS = ["pharm", "amavita", "sun", "assurance", "allianz", "axa", "elvia", "mobiliere", "mobilière", "mutuel", "helvetia", "generali", "vaudoise", "zurich", "zürich", "tcs", "ökk", "oekk", "acs", "sanitas", "assura", "baloise", "bâloise", "concordia", "droguerie", "travail", "salaire", "impot", "impôt"]

def detect_category(description: str):
  description = description.lower()
  for word in NECESSITIES_KEYWORDS:
    if word in description:
      return Transaction.Category.NECESSITY
  for word in TRANSPORTATION_KEYWORDS:
    if word in description:
      return Transaction.Category.TRANSPORTATION
  for word in HOUSING_KEYWORDS:
    if word in description:
      return Transaction.Category.HOUSING
  for word in FOOD_KEYWORDS:
    if word in description:
      return Transaction.Category.FOOD
  for word in LEISURE_KEYWORDS:
    if word in description:
      return Transaction.Category.LEISURE
  return Transaction.Category.OTHER

def load_example_data(filepath: str) -> List[Transaction]:
  data = json.load(open(filepath, "r"))
  json_transactions = data["statement"][1]["transactions"]
  transactions: List[Transaction] = []
  for t in json_transactions:
    try:
      date = datetime.strptime(t["date"], "%Y/%m/%d/%H/%M")
    except:
      date = datetime.strptime(t["date"], "%Y %B %d %H:%M")
    
    amount = Decimal(t["amount"].replace(",", "."))
    if t["type"] == "payment":
      amount *= Decimal("-1")

    try:
      description = t["beneficiary"]
    except:
      description = t["creditor"]

    category = detect_category(description)

    transactions.append(Transaction(
      description,
      date,
      amount,
      category))

  return transactions

def load_bills(user: str) -> List[Transaction]:
  path = os.path.join(os.getcwd(), "example_jsons/")
  filepath = os.path.join(path, "bills_" + user + ".json")
  if not os.path.exists(filepath):
    return []

  data = json.load(open(filepath, "r"), use_decimal=True)
  transactions: List[Transaction] = []

  for t in data:
    date = datetime.fromisoformat(t["date"])
    description = t["description"]
    amount = t["amount"]
    category = Transaction.Category[t["category"]]
    is_monthly = t["is_monthly"]
    try:
      is_paid = t["is_paid"]
    except:
      is_paid = False

    transactions.append(Transaction(
      description,
      date,
      amount,
      category,
      is_monthly,
      is_paid))
  
  return transactions

def load_raw_data(filepath: str) -> List[Transaction]:
  return load_example_data(filepath)