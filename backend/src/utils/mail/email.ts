import { Resend } from "resend";

const resend = new Resend(`${process.env.EMAIL_API_KEY}`);

export const sendEmail = async (email: string, otp: string) => {
  const { data, error } = await resend.emails.send({
    from: `Foodx <foodx@gmail.com>`,
    to: [`${email}`],
    subject: "Verify using OTP",
    html: `<strong>${otp}</strong>`,
  });

  if (error) {
    return 
  }

};
