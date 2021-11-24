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
               category: Category):
    self._description = description
    self._date = date
    self._amount = amount
    self._category = category

  @property
  def amount(self):
    return self._amount

  @property
  def category(self):
    return self._category

  @category.setter
  def category(self, category: Category):
    self._category = category