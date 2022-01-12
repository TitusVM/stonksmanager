from datetime import datetime
from decimal import Decimal
from enum import Enum

class Transaction:
  class Category(Enum):
    HOUSING = 1
    FOOD = 2
    TRANSPORTATION = 3
    LEISURE = 4
    NECESSITY = 5
    OTHER = 6

    def __getstate__(self):
      return self.name

  def __init__(self, description: str, date: datetime, amount: Decimal,
               category: Category, is_monthly=False):
    self._description = description
    self._date = date
    self._amount = amount
    self._category = category
    self._is_monthly = is_monthly

  @property
  def amount(self):
    return self._amount

  @property
  def category(self):
    return self._category

  @category.setter
  def category(self, category: Category):
    self._category = category

  @property
  def date(self):
    return self._date

  @property
  def description(self):
    return self._description

  @property
  def is_monthly(self):
    return self._is_monthly

  def _asdict(self):
    return {
      "description": self._description,
      "date": self._date.isoformat(),
      "amount": self._amount,
      "category": self._category.name,
      "is_monthly": self._is_monthly
    }
