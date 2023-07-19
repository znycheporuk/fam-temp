import { createTransport } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";


const transporter = createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "nycheporuk.zakhar@gmail.com",
		pass: process.env.EMAIL_PASSWORD,
	},
}, {from: `FPM no-reply <nycheporuk.zakhar@gmail.com>`});

export const sendEmail = async (options: Mail.Options) => {
	try {
		await transporter.sendMail(options);
	} catch (err) {
		console.error("Failed to send email", err);
	}
};
