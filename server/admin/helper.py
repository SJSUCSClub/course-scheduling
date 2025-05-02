from core.daos.schedules import schedule_select
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
            "last_name":professor_last_name,
            "full_name":professor_full_name}
