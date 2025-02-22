# Sketch of what the judge code could look like
# Expecting to change this depending on how Eni wants it to be called
from openai import OpenAI

with open(".env", 'r') as file:
    token = file.readlines()[1].strip('\n')

oclient = OpenAI(
    api_key=token
)

