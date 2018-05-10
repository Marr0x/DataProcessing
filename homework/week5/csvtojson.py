#!/usr/bin/env python
# Course: Data Processing 
# Name: Marwa Ahmed
# Student number: 10747141

"""
Source code to convert csv to JSON: https://stackoverflow.com/questions/19697846/how-to-convert-csv-file-to-multiline-json
"""

import json
import csv

# open the read file and the write file
csvfile = open('QoLI2015.csv', 'r')
jsonfile = open('QoLI2015.json', 'w')

# columns in my csv data file
fieldnames = ("Country", "Quality of Life Index")

# read data in dictionary form
reader = csv.DictReader(csvfile, fieldnames)

# list to store dictionaries in 
datalist = []

# dictionary to store the list of dictionaries in
data = {"data": datalist}

# append each row as a dictionary to the list
for row in reader:
	datalist.append(row)

# dump the data as a JSON in the outfile
json.dump(data, jsonfile)

# close files
csvfile.close()
jsonfile.close()