const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP_HOST not set. Email not sent to', to);
    return;
  }
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@restaurant.local',
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };