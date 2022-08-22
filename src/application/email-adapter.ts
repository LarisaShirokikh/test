import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, conformationCode: string) {

        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "200920092022august@gmail.com",//тут емейл в ""
                pass: "indybjghnvagxyxe" //тут пароль в ""
            },
        });

// send mail with defined transport object
        let info = await transport.sendMail({
            from: `"Lora" <${email}>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: `https://some-front.com/confirm-registration?code=${conformationCode}`
        });
        return info
    }
}