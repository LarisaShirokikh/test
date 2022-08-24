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
            conformationCode
        )
        return

    },

    async sendEmailConfirmation(email: string) {
        await emailAdapter.resendEmail(email, "Your Email was confirmed",
            ` <h3> Your Email was confirmed</h3>`)

    }
}


