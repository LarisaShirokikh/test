import {emailAdapter} from "../application/email-adapter";

export const emailManager = {
    async sendPasswordRecoveryMessage(user: any) {
        await emailAdapter
            .sendEmail(
                "user.email",
                "password recovery",
                "<div>${user.recoveryCode}message</div>"
            )
    },

    async sendEmailConfirmationCode(conformationCode: string, email: string) {
        await emailAdapter.sendEmail(email,
            "Confirm your email",
            `<div> Confirm your email: 
            <a href='http://localhost:3000/auth/registration-confirmation?code=${conformationCode}'>Click here</a> </div>`)
    },

    async sendEmailConfirmation(email: string) {
        await emailAdapter.sendEmail(email, "Your Email was confirmed", ` <h3> Your Email was confirmed</h3>`)

    }
}


