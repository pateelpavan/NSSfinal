# Student Data Setup Guide

## Overview
This application uses a code-based approach for managing student data. When users register, admin receives an email notification. Admin then manually adds student data to the code file, and QR codes are auto-generated automatically.

## Workflow

1. **User Registration**: User fills out registration form on the website
2. **Email Notification**: Admin receives email with student details at pateepavan8@gmail.com
3. **Admin Adds Student**: Admin manually adds student to `src/data/students.ts`
4. **QR Code Generation**: QR code is auto-generated with format: `NSS-001-2024`, `NSS-002-2024`, etc.
5. **QR Scanning**: Users can scan QR codes to view student details

## How to Add Student Data

### Step 1: Receive Registration Email
When a student registers, you'll receive an email with their details:
- Full Name
- Roll Number
- Branch
- Email (if provided)
- Phone (if provided)
- Registration Date
- Profile Photo (if uploaded)

### Step 2: Open the Student Data File
Navigate to `src/data/students.ts` in your project.

### Step 3: Add Student Information
Use the template below to add a new student. The QR code will be auto-generated.

```typescript
{
  id: `student-${String(++studentCount).padStart(3, '0')}`,
  fullName: 'Student Full Name', // From registration email
  rollNumber: 'ROLL123', // From registration email
  branch: 'Branch Name', // From registration email
  password: '', // Not needed for QR scanning
  profilePhoto: '', // Add if provided in email
  eventPhotos: [],
  qrCode: generateQRCode(studentCount), // Auto-generated: NSS-001-2024, NSS-002-2024, etc.
  timestamp: Date.now(),
  isApproved: true, // Set to true to make visible
  joinDate: new Date().toISOString().split('T')[0],
  achievements: [],
  certificates: [],
  eventHistory: []
}
```

### Step 4: Important Notes

**Auto-Incrementing QR Codes:**
- QR codes are automatically generated with format: `NSS-{COUNT}-{YEAR}`
- Example: First student gets `NSS-001-2024`, second gets `NSS-002-2024`
- The `studentCount` variable automatically increments
- Use `generateQRCode(studentCount)` function for each new student

**Student Count:**
- Make sure to increment `studentCount` before adding each new student
- The count starts from 0, so first student should use `++studentCount` (which becomes 1)

### Step 5: Example Entry

```typescript
// First student
{
  id: `student-${String(++studentCount).padStart(3, '0')}`, // student-001
  fullName: 'John Doe',
  rollNumber: 'NSS001',
  branch: 'Computer Science',
  password: '',
  profilePhoto: 'https://example.com/photos/john.jpg',
  eventPhotos: [],
  qrCode: generateQRCode(studentCount), // NSS-001-2024
  timestamp: Date.now(),
  isApproved: true,
  joinDate: '2024-01-15',
  achievements: [],
  certificates: [],
  eventHistory: []
},

// Second student
{
  id: `student-${String(++studentCount).padStart(3, '0')}`, // student-002
  fullName: 'Jane Smith',
  rollNumber: 'NSS002',
  branch: 'Electronics',
  password: '',
  profilePhoto: '',
  eventPhotos: [],
  qrCode: generateQRCode(studentCount), // NSS-002-2024
  timestamp: Date.now(),
  isApproved: true,
  joinDate: '2024-01-16',
  achievements: [],
  certificates: [],
  eventHistory: []
}
```

### Step 6: Commit and Push to GitHub
After adding student data:
1. Save the file
2. Commit the changes: `git add src/data/students.ts && git commit -m "Add student: [Student Name]"`
3. Push to GitHub: `git push`

### Step 7: Deploy
After pushing to GitHub, deploy your application. The new student data will be available immediately.

## QR Code Scanning

### How It Works
1. When a user scans a QR code, the scanner looks for a matching `qrCode` value in the student data
2. If found, it displays the student's information
3. Users can click "View Full Portfolio" to see complete student details

### QR Code Format
- Format: `NSS-{COUNT}-{YEAR}`
- Examples: `NSS-001-2024`, `NSS-002-2024`, `NSS-003-2024`
- The QR code must match exactly (case-sensitive)

### Testing QR Codes
You can test by:
1. Going to the "Scan QR" page
2. Entering the `qrCode` value manually in the input field
3. The student data should appear if the QR code matches

## Email Setup

Before students can register, you need to set up EmailJS:
1. See `EMAILJS_SETUP.md` for detailed instructions
2. Configure EmailJS credentials in `src/services/emailService.ts`
3. Test by submitting a registration form

## Notes

- **Unique Roll Numbers:** Each student must have a unique `rollNumber`
- **Auto-Generated QR Codes:** QR codes are automatically generated - don't manually set them
- **Approval Status:** Only students with `isApproved: true` will be visible in the system
- **Profile Photos:** Add image URLs to `profilePhoto` field if provided in registration email
- **No Database Required:** All data is stored in code, no database setup needed

## Troubleshooting

### Student Not Showing After Scan
- Check that the `qrCode` value matches exactly (case-sensitive)
- Ensure `isApproved` is set to `true`
- Verify the student data was saved and deployed
- Check that `studentCount` was incremented correctly

### QR Code Not Working
- Make sure the QR code format is correct: `NSS-{COUNT}-{YEAR}`
- Check for any extra spaces or characters
- Try entering the QR code value manually in the scanner input field
- Verify the `generateQRCode()` function was used

### Email Not Received
- Check EmailJS setup (see `EMAILJS_SETUP.md`)
- Verify email credentials in `src/services/emailService.ts`
- Check spam folder
- Test EmailJS configuration in their dashboard

## Support
For issues or questions, check the main README.md or contact the development team.
