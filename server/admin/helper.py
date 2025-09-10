from core.daos.schedules import schedule_select
from admin.etl.scrapers.schedule_scraping import SJSUScraper
from admin.etl.scrapers.department_scrapping import departments_scraper

import re

#generate csv file name based current schedule values before update
def generate_file_name():
    prev_data= schedule_select(limit=1, page = 1)
    term = prev_data[0]['term']
    year = prev_data[0]['year'] 
    return term+"-"+str(year)+".csv"

#validate url ensuring that it's an sjsu url
def validate_is_sjsu(val:str):
    if "sjsu" not in val:
        return False
    return True 

#get professor info from email, assumes that email uses id
def get_professor_info(professor_email):
    pos = professor_email.find('@')
    professor_id = professor_email[:pos].replace("'","''")#get the professor id from email and adjust for apostrophe
    tmp = professor_id.split(".")
    professor_first_name = re.sub(r'\d+','',tmp[0])#in case of numbers remove numbers
    professor_last_name = re.sub(r'\d+','',tmp[-1])#in case of numbers remove
    professor_full_name = professor_first_name+ " "+ professor_last_name
    return {"professor_email":professor_email,
            "professor_id":professor_id,
            "full_name":professor_full_name}

def scrape_schedules(url:str,term:str,year:str):
    scraper = SJSUScraper(url, term, year)
    content = scraper.getHTML()
    schedules = scraper.parseHTML(content)
    return schedules

def scrape_departments(abbr_dept:str):
    dep_scrapper = departments_scraper(department_tag=abbr_dept)#scrap to get the department full name
    content = dep_scrapper.getHTML()
    dep_name = dep_scrapper.parseHTML(content)
    return dep_name
