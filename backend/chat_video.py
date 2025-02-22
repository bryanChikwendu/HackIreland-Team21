from os import read
import sys
import replicate
from replicate.client import Client
if len(sys.argv) >= 2:
    video = open(sys.argv[1], "rb");
else:
    video = "https://replicate.delivery/pbxt/MV1tNGskZ6lDM0iDmHelOin3dAvOmsbSGQUW6KYhhwKiQMUT/bear.mp4"

with open(".env", 'r') as file:
    token = file.readline().strip('\n')

replicate = Client(api_token=token)

prompt = "What is happening in the video?"
if (len(sys.argv) >= 2):
    sentence = ' '.join(sys.argv[2:])
    prompt = sentence

input = {
    "video": video,
    "prompt": prompt
}



output = replicate.run(
    "lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
    input=input
)
print(output)
