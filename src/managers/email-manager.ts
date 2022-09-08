import {emailAdapter} from "../application/email-adapter";

export const emailManager = {
    async sendPasswordRecoveryMessage() {
        await emailAdapter
            .sendEmail(
                "user.email",
                "password recovery",
                "<div>${user.recoveryCode}message</div>"
            )
    },


    async sendEmailConfirmationCode(conformationCode: string, email: string) {
        await emailAdapter.resendEmail(email,
            "Confirm your email",
            conformationCode
        )

    },

    async sendEmailConfirmation(email: string) {
        await emailAdapter.resendEmail(email, "Your Email was confirmed",
            ` <h3> Your Email was confirmed</h3>`)

    }
}


