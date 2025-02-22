# Sketch of what the judge code could look like
# Expecting to change this depending on how Eni wants it to be called
from openai import OpenAI
from flask import Flask, request

with open(".env", 'r') as file:
    token = file.readlines()[1].strip('\n')

oclient = OpenAI(
    api_key=token
)

chat_completion = oclient.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "What is the fastest LLM on the market. Answer very briefly.",
        }
    ],
    model="gpt-4o",
)
print(chat_completion)

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "This isn't a website! JudgeLLM will await a request with the proper user agent."

@app.route("/update", methods=[ 'POST'])
def upd():
    dat = request.data
    print("Update:",  dat.decode())
    return "Received"
