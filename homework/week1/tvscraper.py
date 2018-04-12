#!/usr/bin/env python
# Name: Marwa Ahmed
# Student number: 10747141
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # make a list to store lists with info about each serie
    list_tv_series = []

    # find the div(s) with serie information
    series = dom.findAll("div", {"class": "lister-item-content"})
    
    # Extract the needed info of each serie
    for serie in series:

        # list to store info of serie in
        nr_serie = []

        title = serie.h3.a.text
        nr_serie.append(title)

        rating = serie.strong.text
        nr_serie.append(rating)

        genre = serie.p.find("span", {"class": "genre"}).string.strip()
        nr_serie.append(genre)

        actors = serie.select("p")[2].text.strip("Stars: \n").replace("\n", "")
        nr_serie.append(actors)

        runtime = serie.p.find("span", {"class": "runtime"}).string.strip(" min")
        nr_serie.append(runtime)

        # store all lists in a list
        list_tv_series.append(nr_serie)

    # return the list with list of the 50 best rated TV series
    return list_tv_series


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write the tv-series to disk
    for row in tvseries:
        writer.writerow(row) 



def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)