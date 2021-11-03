from typing import List
import json
from decimal import Decimal
from datetime import datetime
from transaction import Transaction

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
  data = json.load(open(filepath))
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

def load(filepath: str) -> List[Transaction]:
  return load_example_data(filepath)