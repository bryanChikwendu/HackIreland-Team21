# Sketch of what the judge code could look like
# Expecting to change this depending on how Eni wants it to be called
from openai import OpenAI
from flask import Flask, request
import time
with open(".env", 'r') as file:
    token = file.readlines()[1].strip('\n')

oclient = OpenAI(
    api_key=token
)

past_mes = [
    {"role": "user",
     "content": """You are an LLM designed to judge which action to take,
       given text based updates on what is happening. You will receive timestamped updates
       that are transcriptions of current events, then you must either output 'no action', or choose one from
       'phone call to police', 'phone call to next-of-kin', 'notification to staff' """}
]
chat_completion = oclient.chat.completions.create(
    messages=past_mes,
    model="gpt-4o-mini",
)
past_mes.append(chat_completion.choices[0].message)
print(chat_completion.choices[0].message)
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "This isn't a website! JudgeLLM will await a request with the proper user agent."

@app.route("/update", methods=[ 'POST'])
def upd():

    dat = request.data
    bod = dat.decode()
    t1 = time.time()
    past_mes.append({"role":"user", "content":bod})
    chat_completion = oclient.chat.completions.create(
    messages=past_mes,
    model="gpt-4o-mini",
)
    t2 = time.time()
    resp = chat_completion.choices[0].message.content
    resp += "; Took " + str(t2-t1) + "s"
    past_mes.append(chat_completion.choices[0].message)
    return resp
