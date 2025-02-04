from better_profanity import profanity
def content_check(content: str):
    return profanity.contains_profanity(content)