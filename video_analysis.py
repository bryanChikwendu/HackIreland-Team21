from os import read
from openai import OpenAI
from flask import Flask, request, Response, jsonify
from pydantic import BaseModel
from dotenv import load_dotenv

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS



load_dotenv()


import sys
import replicate
from replicate.client import Client

import json

video = "https://replicate.delivery/pbxt/MV1tNGskZ6lDM0iDmHelOin3dAvOmsbSGQUW6KYhhwKiQMUT/bear.mp4"

# path = "/Users/eniola/Downloads/Dahua\ CCTV\ Night\ Video.mp4"

with open(".env", 'r') as file:
    token = file.readline().strip('\n')
    openai_token = file.readline().strip('\n')

oclient = OpenAI(
    api_key=""
)
replicate = Client(api_token=token)

prompt = "What is happening in the video?"

app = Flask(__name__)

class TimeDur(BaseModel):
    begin: str
    end: str
    
# JSON : {"path":"C:/path/to/mp4.mp4", "prompt":"What time does the baby fall over?"}
@app.route("/ask", methods=['POST'])
def upd():
    content = request.json
    global video
    global prompt
    video = open(content["path"], "rb")
    prompt = content["prompt"]
    input = {
        "video": video,
        "prompt": prompt
    }

    output = replicate.run(
        "lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
        input=input
    )
    print(output)
    gpt_message = [
    {"role": "user",
     "content": "Parse the following sentence, and extract either an exact time, or a timestamped duration, then return only json object with start and end (which may be the same)" + output}
    ]   
    chat_completion = oclient.beta.chat.completions.parse(
        messages=gpt_message,
        model="gpt-4o-mini",
        response_format=TimeDur,
    )  
    parsed = chat_completion.choices[0].message.content 
    print(parsed)
    return Response(parsed, mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)