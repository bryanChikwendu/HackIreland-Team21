from os import read
import replicate
from replicate.client import Client

# video = open("./path/to/my/video.mp4", "rb");

with open(".env", 'r') as file:
    token = file.read()

replicate = Client(api_token=token)

input = {
    "video": "https://replicate.delivery/pbxt/MV1tNGskZ6lDM0iDmHelOin3dAvOmsbSGQUW6KYhhwKiQMUT/bear.mp4",
    "prompt": "What is unusual in the video?"
}



output = replicate.run(
    "lucataco/videollama3-7b:34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
    input=input
)
print(output)
