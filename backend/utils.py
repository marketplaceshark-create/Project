# Path: backend/utils.py
from django.core.mail import send_mail

def notify_user(email, subject, message):
    """
    Centralized email notification handler.
    Call this function from any view/serializer.
    """
    # Log to console for MVP/Debugging
    print(f"\n[EMAIL SIMULATION] To: {email} | Subject: {subject} | Body: {message}\n")
    
    # Actual Email Sending Logic (Uncomment when SMTP is configured in settings.py)
    # try:
    #     send_mail(
    #         subject, 
    #         message, 
    #         'admin@agrivendia.com', # Sender
    #         [email],                # Recipient List
    #         fail_silently=True
    #     )
    # except Exception as e:
    #     print(f"Error sending email: {e}")