import boto3#AWS SDK
import os 
#connect to s3
s3=boto3.client('s3',
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                region_name=os.getenv('AWS_REGION')
            )
"""
Upload files to s3 bucket
args
    bucket_name: bucket to upload to
    file_path: the path to the file would like to upload, this must end with a /
    file: the file you would like to upload
    directory: if would like to add to a specific folder in s3 
"""
#file_path must have a / at the end
def upload_to_bucket(bucket_name:str,file_path:str,file:str, directory=None):
    if(directory):
        directory+="/"
        s3.upload_file(file_path+file,bucket_name,directory+file)
    else:
        s3.upload_file(file_path+file,bucket_name,file)
    os.remove(file_path+file) #remove file once done

"""
Set a limit to how many items can be stored in the bucket
args
    limit: how many items are allowed in the bucket
    bucket_name: bucket enforce limit on
"""
def enforce_s3_limit(limit:int,bucket_name:str):
    res = s3.list_objects_v2(Bucket=bucket_name)
    if 'Contents' in res:
        objs = res['Contents']
        objs.sort(key=lambda x:x['LastModified'])
        while len(objs) > limit:
            oldest = objs[0]
            s3.delete_object(Bucket=bucket_name,Key=oldest['Key'])
            objs.pop(0)
