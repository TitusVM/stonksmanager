import datetime
import os
import simplejson as json
import transaction

from graphs import generate_graph
from loading import load_raw_data, load_bills
from save import save_bills
from typing import List

def filter_transacs(transacs: List[transaction.Transaction], timespan: str):
  filteredtransactions: List[transaction.Transaction] = []

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

  for t in transacs:
    if t.date >= datefilter:
        filteredtransactions.append(t)
  
  return filteredtransactions

def send(obj: list):
  print(json.dumps(obj, use_decimal=True, namedtuple_as_object=True))

def read():
  return json.loads(input(), use_decimal=True)

def help():
  print('Available commands: graph transacs bills')

argc = len(os.sys.argv) - 1
def arg(n: int) -> str:
  return os.sys.argv[n]

if __name__ == '__main__':
  if argc < 1:
    help()
    exit(-1)

  func = arg(1)

  if func == 'graph':
    if argc < 2:
      print('Usage: graph <user> [filter]')
      exit(-1)
    elif argc == 2:
      user = arg(2)
      send(generate_graph(load_bills(user)))
    else:
      user = arg(2)
      date_filter = arg(3)
      send(generate_graph(filter_transacs(load_bills(user), date_filter)))

  elif func == 'transacs':
    if argc < 2:
      print('Usage: transacs <filename>')
      exit(-1)

    filepath = arg(2)
    send(load_raw_data(filepath))

  elif func == 'bills':
    if argc < 3:
      print('Usage: bills <load|save> <user>')
      exit(-1)

    verb = arg(2)
    user = arg(3)

    if verb == 'load':
      send(load_bills(user))

    elif verb == 'save':
      save_bills(user, read())

      pass

    else:
      print('Usage: bills <load|save> <user>')

  else:
    help()
    exit(-1)
