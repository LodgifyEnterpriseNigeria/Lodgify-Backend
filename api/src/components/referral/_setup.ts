import { t } from "elysia"

export const ReferralValidator = {
    getToken: {
        params: t.Object({
            token: t.String({ minLength: 6, maxLength: 50 })
        }),
        detail: {
            tags: ['Referrals']
        }
    }
}

export default ReferralValidator