# Password Management Guide

## Overview
This system has two types of passwords:
1. **Admin Password** - For accessing the admin panel
2. **Student Passwords** - For students to login to their accounts

## Admin Password

### Location
**File:** `src/config/adminConfig.ts`

### Current Password
Default: `CMRIT2025`

### How to Change Admin Password

1. Open `src/config/adminConfig.ts`
2. Change the `ADMIN_PASSWORD` value:
```typescript
export const ADMIN_PASSWORD = 'YourNewPassword123'; // Change this
```
3. Save the file
4. Commit and push to GitHub
5. Deploy your application

### Security Notes
- Choose a strong password
- Don't share the admin password publicly
- Change it regularly for security

## Student Passwords

### Admin Sets Initial Password

When admin adds a student in `src/data/students.ts`, they must set an initial password:

```typescript
createStudent({
  fullName: 'John Doe',
  rollNumber: 'NSS001',
  branch: 'Computer Science',
  password: 'initialpassword123', // REQUIRED: Admin sets this
  isApproved: true
}),
```

### Students Can Change Their Password

Students can change their password after logging in:

1. **Login** to their account using roll number and current password
2. Go to **My Portfolio** page
3. Click **"Change Password"** button
4. Enter:
   - Current password
   - New password (minimum 6 characters)
   - Confirm new password
5. Click **"Change Password"**

### Password Requirements

- Minimum 6 characters
- Must be different from current password
- New password and confirm password must match

### Important Notes

⚠️ **Password Changes are Temporary**
- Password changes made by students are saved in browser localStorage
- For permanent password changes, admin must update `src/data/students.ts`
- If student forgets password, admin can reset it in the code file

### Resetting Student Password (Admin)

If a student forgets their password:

1. Open `src/data/students.ts`
2. Find the student entry
3. Update the password field:
```typescript
createStudent({
  fullName: 'John Doe',
  rollNumber: 'NSS001',
  branch: 'Computer Science',
  password: 'newpassword123', // Update this
  isApproved: true
}),
```
4. Save, commit, and deploy

## Security Best Practices

1. **Admin Password**:
   - Use a strong, unique password
   - Don't commit sensitive passwords to public repositories
   - Consider using environment variables for production

2. **Student Passwords**:
   - Set initial passwords that are easy to remember but secure
   - Encourage students to change their password after first login
   - Use different passwords for different students

3. **General**:
   - Regularly update passwords
   - Don't share passwords via email or insecure channels
   - Use password managers for admin passwords

## Troubleshooting

### Student Can't Login
- Check if password in `students.ts` matches what student is entering
- Verify student is approved (`isApproved: true`)
- Check for typos in roll number or password

### Password Change Not Working
- Clear browser localStorage and try again
- Check browser console for errors
- Verify new password meets requirements (min 6 characters)

### Admin Can't Access Admin Panel
- Verify password in `src/config/adminConfig.ts`
- Check for typos
- Clear browser cache and try again

## Support

For password-related issues:
1. Check this guide
2. Verify configuration files
3. Check browser console for errors
4. Contact development team if issues persist

