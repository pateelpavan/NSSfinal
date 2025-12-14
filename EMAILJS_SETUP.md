# EmailJS Setup Guide

This guide will help you set up EmailJS to send registration notifications to the admin email (pateepavan8@gmail.com).

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. After logging in, go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions:
   - For Gmail: You'll need to connect your Gmail account
   - For other providers: Follow their specific instructions
5. Note your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use the following template:

**Subject:**
```
New NSS Registration: {{fullName}}
```

**Content:**
```
Hello NSS Admin,

A new student has registered for NSS:

Name: {{fullName}}
Roll Number: {{rollNumber}}
Branch: {{branch}}
Email: {{email}}
Phone: {{phone}}
Registration Date: {{registrationDate}}

Please add this student to src/data/students.ts manually.

Best regards,
NSS Registration System
```

4. Save the template and note your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General** in the dashboard
2. Find your **Public Key** (e.g., `abcdefghijklmnop`)

## Step 5: Update Configuration

1. Open `src/services/emailService.ts`
2. Replace the placeholder values:

```typescript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key
```

Example:
```typescript
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_PUBLIC_KEY = 'abcdefghijklmnop';
```

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Go to the registration page
3. Fill out the registration form
4. Submit the form
5. Check the admin email (pateepavan8@gmail.com) for the notification

## Troubleshooting

### Email Not Sending

1. **Check Browser Console**: Open browser DevTools (F12) and check for errors
2. **Verify Credentials**: Make sure all three IDs are correct in `emailService.ts`
3. **Check EmailJS Dashboard**: Look for errors in the EmailJS dashboard
4. **Test Template**: Use EmailJS's "Test" feature in the template editor

### Fallback Method

If EmailJS is not configured, the system will automatically use a `mailto:` link as a fallback, which opens the user's email client.

### Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic email templates
- Standard support

For higher limits, consider upgrading to a paid plan.

## Alternative: Custom API

If you prefer to use your own backend API instead of EmailJS:

1. Create an API endpoint that accepts registration data
2. Update `sendRegistrationViaAPI` function in `emailService.ts`
3. Replace `API_ENDPOINT` with your actual endpoint URL

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

