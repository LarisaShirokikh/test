import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {

        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "forexemple.com",//тут емейл в ""
                pass: "password" //тут пароль в ""
            },
        });

// send mail with defined transport object
        let info = await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });
        return info
    }
}