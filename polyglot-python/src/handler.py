import sys
from os.path import dirname

sys.path.append(dirname(__file__))

def handler(context, inputs):
	print("Executing the Polyglot action from the Demo pacakge")
	print(context)
	print(dir(context))
	
	return [{
		"test1": "value1"
	}]
