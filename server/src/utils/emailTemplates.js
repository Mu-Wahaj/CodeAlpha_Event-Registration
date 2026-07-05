// Plain, table-based HTML email templates (inline styles only — required for email client
// compatibility, unlike the app's Tailwind CSS which browsers render but most inboxes strip).

const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

const wrapper = (title, bodyHtml) => `
<div style="background:#10241E;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#FBF6EC;border-radius:12px;overflow:hidden;">
    <div style="background:#10241E;padding:20px 28px;">
      <span style="color:#E8A33D;font-weight:bold;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Gather</span>
    </div>
    <div style="padding:28px;">
      <h1 style="font-size:20px;color:#10241E;margin:0 0 16px;">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:16px 28px;border-top:1px dashed rgba(16,36,30,0.2);">
      <p style="font-size:11px;color:rgba(16,36,30,0.5);margin:0;">You're receiving this because you have an account on Gather.</p>
    </div>
  </div>
</div>`;

const detailRow = (label, value) => `
  <tr>
    <td style="padding:4px 0;font-size:12px;color:rgba(16,36,30,0.5);text-transform:uppercase;letter-spacing:0.5px;width:110px;">${label}</td>
    <td style="padding:4px 0;font-size:14px;color:#10241E;font-weight:600;">${value}</td>
  </tr>`;

// Sent to the attendee right after they successfully reserve a spot.
const registrationConfirmationEmail = ({ attendeeName, eventTitle, date, location }) =>
  wrapper('You\u2019re confirmed! \uD83C\uDF9F', `
    <p style="font-size:14px;color:rgba(16,36,30,0.75);line-height:1.6;">
      Hi ${attendeeName}, welcome aboard — your spot for <strong>${eventTitle}</strong> is booked. We're glad you'll be there.
    </p>
    <table style="margin-top:16px;width:100%;border-collapse:collapse;">
      ${detailRow('Event', eventTitle)}
      ${detailRow('When', formatDateTime(date))}
      ${detailRow('Where', location)}
    </table>
    <p style="font-size:13px;color:rgba(16,36,30,0.5);margin-top:20px;">
      Plans changed? You can cancel anytime from "My tickets" in your account.
    </p>
  `);

// Sent to the organizer right after they create a new event.
const eventCreatedEmail = ({ organizerName, eventTitle, date, location }) =>
  wrapper('Your event is live', `
    <p style="font-size:14px;color:rgba(16,36,30,0.75);line-height:1.6;">
      Hi ${organizerName}, <strong>${eventTitle}</strong> has been published and is now open for registrations.
    </p>
    <table style="margin-top:16px;width:100%;border-collapse:collapse;">
      ${detailRow('Event', eventTitle)}
      ${detailRow('When', formatDateTime(date))}
      ${detailRow('Where', location)}
    </table>
    <p style="font-size:13px;color:rgba(16,36,30,0.5);margin-top:20px;">
      You'll get an email every time someone registers. You can manage this event anytime from "My events".
    </p>
  `);

// Sent to the organizer every time someone registers for one of their events.
const newRegistrationNotificationEmail = ({ organizerName, eventTitle, attendeeName, attendeeEmail, spotsLeft }) =>
  wrapper('New registration', `
    <p style="font-size:14px;color:rgba(16,36,30,0.75);line-height:1.6;">
      Hi ${organizerName}, <strong>${attendeeName}</strong> (${attendeeEmail}) just registered for <strong>${eventTitle}</strong>.
    </p>
    <table style="margin-top:16px;width:100%;border-collapse:collapse;">
      ${detailRow('Event', eventTitle)}
      ${detailRow('Attendee', `${attendeeName} — ${attendeeEmail}`)}
      ${detailRow('Spots left', String(spotsLeft))}
    </table>
  `);

module.exports = { registrationConfirmationEmail, eventCreatedEmail, newRegistrationNotificationEmail };