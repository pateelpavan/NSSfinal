/**
 * Email Service
 * Sends registration notifications to admin email
 * 
 * Setup Instructions:
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with the following variables:
 *    - {{fullName}}
 *    - {{rollNumber}}
 *    - {{branch}}
 *    - {{email}} (optional)
 *    - {{phone}} (optional)
 *    - {{registrationDate}}
 *    - {{profilePhoto}} (base64 image)
 * 4. Get your Public Key, Service ID, and Template ID
 * 5. Update the constants below with your EmailJS credentials
 */

// EmailJS Configuration
// Replace these with your EmailJS credentials after setup
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Get from EmailJS dashboard
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Get from EmailJS dashboard
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Get from EmailJS dashboard
const ADMIN_EMAIL = 'pateepavan8@gmail.com';

export interface RegistrationData {
  fullName: string;
  rollNumber: string;
  branch: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  registrationDate: string;
}

/**
 * Send registration notification email to admin
 */
export async function sendRegistrationEmail(data: RegistrationData): Promise<boolean> {
  try {
    // Check if EmailJS is configured
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.warn('EmailJS not configured. Please set up EmailJS credentials in src/services/emailService.ts');
      
      // Fallback: Use mailto link (opens email client)
      const subject = encodeURIComponent(`New NSS Registration: ${data.fullName}`);
      const body = encodeURIComponent(`
New NSS Volunteer Registration:

Name: ${data.fullName}
Roll Number: ${data.rollNumber}
Branch: ${data.branch}
Email: ${data.email || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Registration Date: ${data.registrationDate}

Please add this student to the system manually.
      `);
      
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
      return true;
    }

    // Load EmailJS SDK dynamically
    if (typeof window !== 'undefined' && !(window as any).emailjs) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.async = true;
      document.head.appendChild(script);
      
      // Wait for EmailJS to load
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Initialize EmailJS
    if ((window as any).emailjs) {
      (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // Prepare email template parameters
    const templateParams = {
      to_email: ADMIN_EMAIL,
      to_name: 'NSS Admin',
      fullName: data.fullName,
      rollNumber: data.rollNumber,
      branch: data.branch,
      email: data.email || 'Not provided',
      phone: data.phone || 'Not provided',
      registrationDate: data.registrationDate,
      profilePhoto: data.profilePhoto || '',
      message: `
New NSS Volunteer Registration:

Name: ${data.fullName}
Roll Number: ${data.rollNumber}
Branch: ${data.branch}
Email: ${data.email || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Registration Date: ${data.registrationDate}

Please add this student to src/data/students.ts manually.
      `
    };

    // Send email using EmailJS
    const response = await (window as any).emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Fallback to mailto
    const subject = encodeURIComponent(`New NSS Registration: ${data.fullName}`);
    const body = encodeURIComponent(`
New NSS Volunteer Registration:

Name: ${data.fullName}
Roll Number: ${data.rollNumber}
Branch: ${data.branch}
Email: ${data.email || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Registration Date: ${data.registrationDate}

Please add this student to src/data/students.ts manually.
    `);
    
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    return false;
  }
}

/**
 * Alternative: Use a simple API endpoint (if you have a backend)
 * This is a placeholder - you would need to create your own API endpoint
 */
export async function sendRegistrationViaAPI(data: RegistrationData): Promise<boolean> {
  try {
    // Replace with your actual API endpoint
    const API_ENDPOINT = 'https://your-api-endpoint.com/send-email';
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: `New NSS Registration: ${data.fullName}`,
        data: data
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email via API:', error);
    return false;
  }
}

