import random

NAMES = ['Stephan', 'Daan', 'Kees', 'Dennis', 'Gerard']

def get_name():
	return random.choice(NAMES)

print("Hallo, ik ben {naam}".format(naam=get_name()))



