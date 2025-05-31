import { t } from 'elysia'

export const OTPValidator = {
    generateOTP_Email: {
        body: t.Object({
            sessionId: t.String(),
        }),
        detail: {
            tags: ['OTP']
        }
    },
    verifyOTP_Email: {
        body: t.Object({
            sessionId: t.String(),
            otp: t.String()
        }),
        detail: {
            tags: ['OTP']
        }
    }
}