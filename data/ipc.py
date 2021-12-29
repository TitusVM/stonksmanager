import os
import jsonpickle

jsonpickle.set_preferred_backend('simplejson')
jsonpickle.set_decoder_options('simplejson',
                               use_decimal=True)
jsonpickle.set_preferred_backend('simplejson')

def graph(filepath: str, timespan: str):
  from loading import load
  from graphs import generate_graph
  from typing import List
  from transaction import Transaction
  import datetime

  transactions = load(filepath)
  filteredtransactions: List[Transaction] = []

  if timespan == 'day':
    datefilter = datetime.datetime.now() - datetime.timedelta(days=1)
  elif timespan == 'month':
    datefilter = datetime.datetime.now() - datetime.timedelta(days=31)
  elif timespan == '6month':
    datefilter = datetime.datetime.now() - datetime.timedelta(days=(31*6))
  elif timespan == 'year':
    datefilter = datetime.datetime.now() - datetime.timedelta(days=365)
  else:
    datefilter = datetime.datetime(1000, 1, 1)

  for t in transactions:
    if t.date >= datefilter:
        filteredtransactions.append(t)
  
  print(jsonpickle.encode(generate_graph(filteredtransactions), unpicklable=False, use_decimal=True))


def transacs(filepath: str):
  from loading import load
  print(jsonpickle.encode(load(filepath), unpicklable=False, use_decimal=True))

if __name__ == "__main__":
  func = os.sys.argv[1]
  if func == "graph":
    graph(os.sys.argv[2], os.sys.argv[3])
  elif func == "transacs":
    transacs(os.sys.argv[2])