import type { NSSUser } from '../App';

/**
 * Student Data File
 * 
 * Admin Instructions:
 * 1. When you receive a registration email, add the student data here
 * 2. Each student should have a unique rollNumber
 * 3. QR code is auto-generated with format: NSS-{COUNT}-{YEAR}
 *    Example: NSS-001-2024, NSS-002-2024, etc.
 * 4. Set isApproved to true for students who should be visible
 * 5. After making changes, commit and push to GitHub
 * 
 * The QR code scanner will automatically show student data when scanned.
 */

// Helper function to generate auto-incrementing QR code
function generateQRCode(count: number): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count).padStart(3, '0');
  return `NSS-${paddedCount}-${year}`;
}

// Student count - starts at 0, increments automatically when students are added
let studentCount = 0;

// Helper function to create a student with auto-generated ID and QR code
function createStudent(studentData: {
  fullName: string;
  rollNumber: string;
  branch: string;
  password: string; // REQUIRED: Admin must set initial password
  profilePhoto?: string;
  eventPhotos?: any[];
  timestamp?: number;
  isApproved?: boolean;
  joinDate?: string;
  achievements?: any[];
  certificates?: any[];
  eventHistory?: any[];
}): NSSUser {
  studentCount++;
  return {
    id: `student-${String(studentCount).padStart(3, '0')}`,
    fullName: studentData.fullName,
    rollNumber: studentData.rollNumber,
    branch: studentData.branch,
    password: studentData.password, // Required - admin sets initial password
    profilePhoto: studentData.profilePhoto || '',
    eventPhotos: studentData.eventPhotos || [],
    qrCode: generateQRCode(studentCount), // Auto-generated: NSS-001-2024, NSS-002-2024, etc.
    timestamp: studentData.timestamp || Date.now(),
    isApproved: studentData.isApproved !== undefined ? studentData.isApproved : true,
    joinDate: studentData.joinDate || new Date().toISOString().split('T')[0],
    achievements: studentData.achievements || [],
    certificates: studentData.certificates || [],
    eventHistory: studentData.eventHistory || []
  };
}

export const studentsData: NSSUser[] = [
  // Add students here using the createStudent() function
  // Example:
  createStudent({
    fullName: 'PAVAN PATEEL',
    rollNumber: '24R05A6622',
    branch: 'CSE',
    password: 'pAVAN@123', // REQUIRED: Admin sets initial password
    profilePhoto: 'https://media.licdn.com/dms/image/v2/D4D03AQH4k-dvdIawbQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1724252015811?e=1767225600&v=beta&t=V8ZQjOQc1Ogg9Ji8mvQY1AGPBBRnoeSvielVsCJCdzo', // Optional: Add image URL if available
    isApproved: true,
    joinDate: '2025-12-14',
    achievements: [],
    certificates: [],
    eventHistory: [],
  }),
  
  // Template for adding new students:
  // Copy this template and fill in the details from the registration email
  // createStudent({
  //   fullName: 'Student Full Name', // From registration email
  //   rollNumber: 'ROLL123', // From registration email
  //   branch: 'Branch Name', // From registration email
  //   password: 'initialpassword123', // REQUIRED: Admin sets initial password (user can change later)
  //   profilePhoto: '', // Optional: Add if provided in email
  //   isApproved: true // Set to true to make visible
  // }),
];

// Export the current count for reference
export const getNextStudentCount = () => studentCount + 1;
export const getNextQRCode = () => generateQRCode(studentCount + 1);
