import { createWelcomeEmailTemplate } from './emailTemplates.js';
import { resendClient, sender } from '../lib/resend.js';

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: `Benvenuto in Single Game, ${name}!`,
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error('error sending welcome email', error);
    throw new Error('failed to send welcome email');
  }

  console.log('welcome email sent successfully');
};

export const sendResetPasswordEmail = async (email, name, resetURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: `Reset Password Single Game, ${name}!`,
    html: createWelcomeEmailTemplate(name, resetURL),
  });

  if (error) {
    console.error('error sending welcome email', error);
    throw new Error('failed to send welcome email');
  }

  console.log('reset email sent successfully');
};
