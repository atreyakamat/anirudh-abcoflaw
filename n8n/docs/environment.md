# Environment Variables — n8n & Automation Layer

The following environment variables configure the automation layer:

```env
# Backend Webhook Publisher
N8N_WEBHOOK_BASE_URL=http://localhost:5678
N8N_WEBHOOK_SECRET=dev-webhook-secret-key-change-in-production

# Telegram Integration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_RECEPTION_CHAT_ID=-100123456789

# Twilio SMS
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXAAAAAAAAAAAAAAAA
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+18005550199

# OpenAI LLM Node
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# Google Calendar OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
