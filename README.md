# Team21 - Centrion
## AI Video Analysis for Everything
We provide the ability to make any camera or stream intelligent.  
- Monitor for *anything* and configure custom responses
- Intelligently converse with your recorded footage.
- Reason about the content of live video in *real-time*.

## Setup
Create a file named .env in the same directory as the backend, where the first line is your [Replicate key](https://replicate.com/), and the second line is an openAI key.  
Similarly, configure the Google Gemini keys.  
Run the backend Flask application on port *8000*.   
Run the frontend React application.  
> [!NOTE]
> Mac users may need to modify some file-paths in the frontend (C:/Users.. => Users/)

## Tech Stack
Python (Flask) + Javascript (React).  
Replicate is used to host and run more bespoke models.  
Various APIs from Google and OpenAI are used to call their standard models.
