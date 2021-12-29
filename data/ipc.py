import datetime
import os
import simplejson as json
import transaction

from graphs import generate_graph
from loading import load_raw_data, load_bills
from save import save_bills


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
      print('Usage: graph <user>')
      exit(-1)

    user = arg(2)
    send(generate_graph(load_bills(user)))

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