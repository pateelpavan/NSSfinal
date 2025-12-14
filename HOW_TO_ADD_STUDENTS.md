# How to Add Student Details - Quick Guide

## Location
**File:** `src/data/students.ts`

## Step-by-Step Instructions

### Step 1: Open the File
Navigate to: `src/data/students.ts`

### Step 2: Find the Array
Look for this section (around line 61):
```typescript
export const studentsData: NSSUser[] = [
  // Add students here
];
```

### Step 3: Add Student Using createStudent() Function

Inside the `studentsData` array, add students like this:

```typescript
export const studentsData: NSSUser[] = [
  // First student
  createStudent({
    fullName: 'John Doe',
    rollNumber: 'NSS001',
    branch: 'Computer Science Engineering',
    password: 'initialpassword123', // REQUIRED: Admin sets initial password
    profilePhoto: '', // Optional: Add image URL if available
    isApproved: true
  }),
  
  // Second student
  createStudent({
    fullName: 'Jane Smith',
    rollNumber: 'NSS002',
    branch: 'Electronics and Communication Engineering',
    password: 'initialpassword456', // REQUIRED: Admin sets initial password
    profilePhoto: 'https://example.com/photos/jane.jpg', // Optional
    isApproved: true
  }),
  
  // Add more students here...
];
```

## Complete Example

Here's a complete example with all fields:

```typescript
export const studentsData: NSSUser[] = [
  createStudent({
    fullName: 'Rajesh Kumar',
    rollNumber: 'NSS001',
    branch: 'Computer Science Engineering',
    profilePhoto: 'https://example.com/photos/rajesh.jpg', // Optional
    isApproved: true, // Set to true to make visible
    joinDate: '2024-01-15' // Optional: Defaults to today
  }),
  
  createStudent({
    fullName: 'Priya Sharma',
    rollNumber: 'NSS002',
    branch: 'Electronics and Communication Engineering',
    profilePhoto: '', // No photo
    isApproved: true
  }),
];
```

## Important Notes

1. **QR Code is Auto-Generated**: You don't need to set the QR code manually. It will be automatically generated as:
   - First student: `NSS-001-2024`
   - Second student: `NSS-002-2024`
   - Third student: `NSS-003-2024`
   - And so on...

2. **Required Fields**:
   - `fullName` - Student's full name
   - `rollNumber` - Unique roll number
   - `branch` - Branch/Department name
   - `password` - **REQUIRED**: Initial password set by admin (user can change later)

3. **Optional Fields**:
   - `profilePhoto` - Image URL (leave empty string '' if not available)
   - `isApproved` - Set to `true` to make student visible (defaults to true)
   - `joinDate` - Date in format 'YYYY-MM-DD' (defaults to today)

4. **After Adding**:
   - Save the file
   - Commit to Git: `git add src/data/students.ts && git commit -m "Add student: [Name]"`
   - Push to GitHub: `git push`
   - Deploy your application

## Quick Copy-Paste Template

```typescript
createStudent({
  fullName: '', // From registration email
  rollNumber: '', // From registration email
  branch: '', // From registration email
  password: '', // REQUIRED: Set initial password (user can change later)
  profilePhoto: '', // Optional: Add if provided in email
  isApproved: true
}),
```

## Visual Guide

```
src/data/students.ts
│
├── Line 61: export const studentsData: NSSUser[] = [
│   │
│   ├── Line 62-70: Add your first student here
│   │   createStudent({ ... }),
│   │
│   ├── Line 71-79: Add your second student here
│   │   createStudent({ ... }),
│   │
│   └── Line 80: Add more students...
│
└── Line 81: ];
```

## Example from Registration Email

When you receive a registration email like:
```
Name: Rajesh Kumar
Roll Number: NSS001
Branch: Computer Science Engineering
Email: rajesh@example.com
Phone: +91 1234567890
```

Add it to the code as:
```typescript
createStudent({
  fullName: 'Rajesh Kumar',
  rollNumber: 'NSS001',
  branch: 'Computer Science Engineering',
  profilePhoto: '', // Add if photo was provided
  isApproved: true
}),
```

That's it! The QR code will be automatically generated.

