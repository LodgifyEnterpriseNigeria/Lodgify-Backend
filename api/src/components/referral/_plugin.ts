import Elysia from "elysia";
import getTokenInfo from "./controllers/getTokenInfo.route";

const referalPlugin = new Elysia({
    prefix: "/referral"
})
    .use(getTokenInfo)

export default referalPlugin