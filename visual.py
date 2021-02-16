from pymongo import MongoClient
from datetime import datetime, timezone

import matplotlib.pyplot as plt

def utc_to_local(utc_dt):
	return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None)

client = MongoClient()
db = client.moodb
collection = db.entries
user_sessions = []
for item in collection.find():
	u = item['username']
	s = item['session']
	if (u, s) not in user_sessions:
		user_sessions.append((u, s))
		
events = db.events

def get_session_events(user, session):
	return events.find({'username':user,'session':session})


def get_session(user, session):	   
	return collection.find({'username':user,'session':session})

def get_changes(entries):
	out_data = []
	prev_mood = '-1'
	prev = entries[0]
	for entry in entries:
		if entry['mood'] != prev_mood:
						out_data.append(prev)
						out_data.append(entry)
		prev_mood = entry['mood']
		prev = entry
	return out_data

def findHeight(time1, time2, midTime, mood1, mood2):
		time_elapsed = time2 - time1
		time_a = midTime - time1
		fraction = time_a/time_elapsed
		mood_d = mood2 - mood1
		add = fraction * mood_d
		return mood1 + add

def getClosestTwo(time, X):
		if time < X[0]:
				return False, False
		i = 0
		i1 = 1
		while i1 < len(X):
				if time > X[i] and time < X[i1]:
						return i, i1
				i += 1
				i1 += 1
		raise "cant have event at end"

def plot_session(user, session, ax = None):
	X = []
	Y = []
	EVENTS = []
	EVENTSY = []
	labels = []
	for i in sorted(get_session(user, session), key=lambda x: x['time']):
		X.append(utc_to_local(i['time']))
		Y.append(int(i['mood']))
	for i in get_session_events(user, session):
		EVENTS.append(utc_to_local(i['time']))
		labels.append(i['event'])
		u = utc_to_local(i['time'])
		a, b = getClosestTwo(u, X)
		if not a and not b:
			EVENTSY.append(0)
		else:
			EVENTSY.append(findHeight(X[a], X[b], u, Y[a], Y[b]))
	if not ax:
		plt.plot(X,Y)
		plt.plot(EVENTS, EVENTSY, 'go')
		plt.ylim([0, 16])
		plt.title(user + ' ' + session)
		if labels:
			ii = 0
			for x,y in zip(EVENTS,EVENTSY):
				label = labels[ii]
				ii+=1
				plt.annotate(label, (x,y), textcoords="offset points", xytext=(0,5),ha="center")
		plt.show()
	else:
		ax.plot(X, Y);
		ax.plot(EVENTS, [8 for i in EVENTS], 'go')
		ax.set_ylim([0, 16])
		ax.set_title(user + ' ' + session)
		if labels:
			ii = 0
			for x,y in zip(EVENTS,EVENTSY):
				label = labels[ii]
				ii+=1
				ax.annotate(label, (x,y), textcoords="offset points", xytext=(0,5),ha="center")

import csv

def save_entries(entries):
	with open('output.tsv', 'wt') as out_file:
		tsv = csv.writer(out_file, delimiter='\t')
		for entry in entries:
			tsv.writerow(list(dict(entry).values()))

def plot_all_sessions(user_sessions):
	fig, axs = plt.subplots(len(user_sessions))
	i = 0
	for u, s in user_sessions:
		plot_session(u, s)
		i += 1
	plt.show()
plot_session("GAVIN", "0");
