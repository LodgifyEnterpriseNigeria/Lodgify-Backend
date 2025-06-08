import Elysia from "elysia";
import getTokenInfo from "./controllers/getTokenInfo.route";

const referalPlugin = new Elysia({
    prefix: "/referal"
})
    .use(getTokenInfo)

export default referalPlugin