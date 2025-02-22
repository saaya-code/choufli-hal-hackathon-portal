import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
        auth: {
            user: process.env.GMAIL_USER, 
            pass: process.env.GMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
        html, 
    };

   
      await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
  });
    
}
