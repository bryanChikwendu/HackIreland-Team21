from os import read
import sys
import replicate
from replicate.client import Client
if len(sys.argv) >= 2:
    video = open(sys.argv[2], "rb");
else:
    video = "dummy_url_here"

with open(".env", 'r') as file:
    token = file.read()

replicate = Client(api_token=token)

input = {
    "video": video,
    "prompt": sys.argv[1]
}



output = replicate.run(
    "lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
    input=input
)
print(output)
