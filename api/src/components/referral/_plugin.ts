import Elysia from "elysia";
import getTokenInfo from "./controllers/getTokenInfo.route";
import adminHandleReferrals from "./controllers/adminHanldeReferral.route";

const referalPlugin = new Elysia({
    prefix: "/referral"
})
    .use(getTokenInfo)
    .use(adminHandleReferrals)
    
export default referalPlugin