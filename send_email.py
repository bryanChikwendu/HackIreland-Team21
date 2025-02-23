from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

def send_email(recipient, subject, body):
    # Email configuration
    sender_email = "@gmail.com"  # Replace with your email
    sender_password = ""   # Replace with your app password
    
    # Create message
    message = MIMEText(body)
    message["From"] = sender_email
    message["To"] = recipient
    message["Subject"] = subject
    
    # Add body to email
    message.attach(MIMEText(body, "plain"))
    
    try:
        # Create SMTP session
        with smtplib.SMTP_SSL("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            
            # Send email
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/send-email', methods=['POST'])
def handle_send_email():
    data = request.get_json()
    
    # Check required fields
    required_fields = ['recipient', 'subject', 'body']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Send email
    success = send_email(
        data['recipient'],
        data['subject'],
        data['body']
    )
    
    if success:
        return jsonify({'message': 'Email sent successfully'}), 200
    else:
        return jsonify({'error': 'Failed to send email'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8003)