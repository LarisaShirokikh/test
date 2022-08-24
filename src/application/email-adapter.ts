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
        let info = await transport.sendMail({
            from: `"Lora" <200920092022august@gmail.com>`,
            to: email,
            subject: subject,
            text: `https://some-front.com/confirm-registration?code=${conformationCode}`
        });
        return
    },

    async resendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "200920092022august@gmail.com", // generated ethereal user
                pass: "indybjghnvagxyxe", // generated ethereal password
            },
        });
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <200920092022august@gmail.com>',
            to: email,
            subject: subject,
            html: message,
        });

        console.log(info)
        return info
    }
}