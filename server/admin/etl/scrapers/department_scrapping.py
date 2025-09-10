import re
import requests
from bs4 import BeautifulSoup
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

#Scrapper used to grab the full name of a department
class departments_scraper:
    def __init__(self,department_tag):
        self.url=f'https://catalog.sjsu.edu/content.php?filter[27]={department_tag}&filter[29]=&filter[keyword]=&filter[32]=1&filter[cpage]=1&cur_cat_oid=15&expand=&navoid=5382&search_database=Filter&filter[exact_match]=1#acalog_template_course_filter'

    def getHTML(self):
        response = requests.get(self.url)
        response.raise_for_status()
        return response.content

    def parseHTML(self, html):
        soup = BeautifulSoup(html, "html.parser")
        res = []
        strong_elements = soup.find_all("strong")
        for s in strong_elements:
            res.append(s.text)
        return res
