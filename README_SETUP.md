# Complete Setup Guide

This guide covers the complete setup process for the NSS Registration System.

## Quick Start

1. **Remove Database Dependencies** ✅
   - All SQL database files have been removed
   - No database setup required

2. **Set Up Email Notifications** 📧
   - Follow `EMAILJS_SETUP.md` to configure email notifications
   - Admin email: pateepavan8@gmail.com

3. **Add Student Data** 👥
   - Follow `STUDENT_DATA_SETUP.md` to add students manually
   - QR codes are auto-generated

## System Architecture

### Registration Flow
```
User Registration → Email to Admin → Admin Adds to Code → QR Code Generated → User Can Scan
```

### Components

1. **Registration Form** (`src/components/NSSRegistrationForm.tsx`)
   - Users fill out registration form
   - Data is sent to admin via email
   - No database storage

2. **Email Service** (`src/services/emailService.ts`)
   - Sends registration notifications
   - Uses EmailJS (free tier available)
   - Fallback to mailto: if EmailJS not configured

3. **Student Data** (`src/data/students.ts`)
   - Admin manually adds students here
   - QR codes auto-generated with format: `NSS-001-2024`
   - Auto-incrementing count

4. **QR Scanner** (`src/components/NSSQrScanner.tsx`)
   - Scans QR codes
   - Displays student information
   - Links to full portfolio

## Setup Steps

### 1. Email Setup (Required)
See `EMAILJS_SETUP.md` for:
- Creating EmailJS account
- Configuring email service
- Setting up email template
- Adding credentials to code

### 2. Student Data Management
See `STUDENT_DATA_SETUP.md` for:
- Adding students manually
- Understanding QR code generation
- Best practices

### 3. Testing
1. Start development server: `npm run dev`
2. Test registration form
3. Check admin email for notification
4. Add student to `students.ts`
5. Test QR code scanning

## File Structure

```
src/
├── components/
│   ├── NSSRegistrationForm.tsx  # Registration form
│   ├── NSSQrScanner.tsx          # QR code scanner
│   └── ...
├── data/
│   └── students.ts               # Student data (admin edits this)
├── services/
│   └── emailService.ts           # Email notification service
└── App.tsx                       # Main app component
```

## Configuration

### Email Service Configuration
Edit `src/services/emailService.ts`:
```typescript
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';
const ADMIN_EMAIL = 'pateepavan8@gmail.com';
```

### Student Data
Edit `src/data/students.ts` to add students manually.

## Features

✅ **No Database Required** - All data in code
✅ **Email Notifications** - Admin receives registration emails
✅ **Auto-Generated QR Codes** - Format: NSS-001-2024, NSS-002-2024, etc.
✅ **QR Code Scanning** - Users can scan to view student details
✅ **Manual Admin Control** - Admin adds students manually after email notification

## Troubleshooting

### Email Not Sending
- Check EmailJS configuration
- Verify credentials in `emailService.ts`
- See `EMAILJS_SETUP.md`

### QR Code Not Working
- Verify QR code format matches: `NSS-{COUNT}-{YEAR}`
- Check student data in `students.ts`
- Ensure `isApproved: true`

### Student Not Appearing
- Check `isApproved` is set to `true`
- Verify student data was saved
- Check deployment was successful

## Support

- Email Setup: See `EMAILJS_SETUP.md`
- Student Data: See `STUDENT_DATA_SETUP.md`
- General Issues: Check main README.md

