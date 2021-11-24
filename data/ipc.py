import os
import jsonpickle

def graph(filepath: str):
  from loading import load
  from graphs import generate_graph
  print(jsonpickle.encode(generate_graph(load(filepath)), unpicklable=False, use_decimal=True))

def transacs(filepath: str):
  from loading import load
  print(jsonpickle.encode(load(filepath), unpicklable=False, use_decimal=True))

if __name__ == "__main__":
  func = os.sys.argv[1]
  if func == "graph":
    graph(os.sys.argv[2])
  elif func == "transacs":
    transacs(os.sys.argv[2])