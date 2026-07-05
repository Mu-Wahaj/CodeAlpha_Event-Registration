// Sends transactional emails via Gmail SMTP. Falls back to logging (no crash) if
// EMAIL_USER / EMAIL_APP_PASSWORD aren't configured, so the app still works without email set up.
const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter = null;

const isConfigured = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // upgrades to TLS via STARTTLS on port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
  return transporter;
};

// Fire-and-forget: logs and swallows errors so a failed email never breaks the API response.
const sendEmail = async ({ to, subject, html }) => {
  if (!isConfigured()) {
    logger.warn(`Email skipped (EMAIL_USER/EMAIL_APP_PASSWORD not set) — would have sent "${subject}" to ${to}`);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: `"Gather" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
  }
};

module.exports = sendEmail;