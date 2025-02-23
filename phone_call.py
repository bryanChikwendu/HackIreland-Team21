# import os
# from twilio.rest import Client

# # ------------------------------------------------------------------------------
# # Hardcoded summary for MVP (this would be LLM-generated in the real system)
# # ------------------------------------------------------------------------------
# HARD_CODED_SUMMARY = """
# Alert! 
# At 3:45 PM, camera #4 detected suspicious activity. 
# It appears there is a person holding a firearm near the main entrance. 
# Recommended action: Immediate security response.
# """


# def main():
#     # 1. Twilio Credentials (Replace with real credentials)
#     #    For production, DO NOT HARD-CODE. Use environment variables or a vault.
#     TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
#     TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
#     TWILIO_CALLER_NUMBER = os.getenv("TWILIO_CALLER_NUMBER", "+353469045001")  # Our Twilio number
#     TARGET_PHONE_NUMBER = os.getenv("TARGET_PHONE_NUMBER", "+")  # Number to call

#     # 2. Create Twilio client
#     client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

#     # 3. Build TwiML with <Say> verb to read the summary
#     #    Twilio can generate the speech automatically, using "alice" voice by default.
#     twiml_content = f"""
#     <Response>
#         <Say voice="alice">
#             {HARD_CODED_SUMMARY}
#         </Say>
#     </Response>
#     """

#     try:
#         # 4. Place the call
#         call = client.calls.create(
#             to=TARGET_PHONE_NUMBER,
#             from_=TWILIO_CALLER_NUMBER,
#             twiml=twiml_content
#         )

#         print("Call placed successfully!")
#         print(f"Call SID: {call.sid}")

#     except Exception as e:
#         print("Failed to place call.")
#         print(e)


# if __name__ == "__main__":
#     main()

from flask import Flask, jsonify
import os
from twilio.rest import Client
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS

# ------------------------------------------------------------------------------
# Hardcoded summary for MVP (this would be LLM-generated in the real system)
# ------------------------------------------------------------------------------
HARD_CODED_SUMMARY = """
Alert! 
At 3:45 PM, camera #4 detected suspicious activity. 
It appears there is a person holding a firearm near the main entrance. 
Recommended action: Immediate security response.
"""

def place_emergency_call():
    # 1. Twilio Credentials (Replace with real credentials)
    #    For production, DO NOT HARD-CODE. Use environment variables or a vault.
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "AC11da00c915861200f3678e7d4744ea94")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "0cb82c67166885f8d3c5ea95abbfbfc1")
    TWILIO_CALLER_NUMBER = os.getenv("TWILIO_CALLER_NUMBER", "+353469045001")  # Our Twilio number
    TARGET_PHONE_NUMBER = os.getenv("TARGET_PHONE_NUMBER", "+353857347399")  # Number to call

    # 2. Create Twilio client
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    # 3. Build TwiML with <Say> verb to read the summary
    #    Twilio can generate the speech automatically, using "alice" voice by default.
    twiml_content = f"""
    <Response>
        <Say voice="alice">
            {HARD_CODED_SUMMARY}
        </Say>
    </Response>
    """

    try:
        # 4. Place the call
        call = client.calls.create(
            to=TARGET_PHONE_NUMBER,
            from_=TWILIO_CALLER_NUMBER,
            twiml=twiml_content
        )

        return {
            "status": "success",
            "message": "Call placed successfully",
            "call_sid": call.sid
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.route('/trigger-alert', methods=['POST'])
def trigger_alert():
    """Endpoint to trigger the emergency call"""
    result = place_emergency_call()
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8001)