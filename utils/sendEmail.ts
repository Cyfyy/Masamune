import nodemailer from 'nodemailer';

// You can modify this with a service like SendGrid, Mailgun, etc.
export const sendPasswordResetEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider here (e.g., SendGrid, Mailgun)
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password', // Replace with your password or app-specific password
    },
  });

  const resetLink = `https://your-website.com/reset-password/${email}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
