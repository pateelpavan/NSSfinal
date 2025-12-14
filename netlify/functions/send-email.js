exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pateepavan8@gmail.com';
    if (!RESEND_API_KEY) {
      return { statusCode: 500, body: 'Missing RESEND_API_KEY env var' };
    }

    const payload = JSON.parse(event.body || '{}');
    const { type, user } = payload;

    const subject = type === 'registration'
      ? `New NSS registration: ${user?.fullName || ''} (${user?.rollNumber || ''})`
      : 'NSS Notification';

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>NSS Website Notification</h2>
        <p><strong>Type:</strong> ${type}</p>
        ${user ? `
        <ul>
          <li><strong>Name:</strong> ${user.fullName}</li>
          <li><strong>Roll Number:</strong> ${user.rollNumber}</li>
          <li><strong>Branch:</strong> ${user.branch}</li>
          <li><strong>ID:</strong> ${user.id}</li>
        </ul>` : ''}
      </div>
    `;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@your-domain.example',
        to: [ADMIN_EMAIL],
        subject,
        html
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, body: `Resend error: ${text}` };
    }

    const data = await resp.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: data?.id })
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err?.message || String(err)}` };
  }
};
