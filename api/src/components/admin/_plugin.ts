import Elysia from "elysia";
import registerAdmin from "./controllers/registerAdmin.route";
import signAdmin from "./controllers/signAdmin.route";

const adminPlugin = new Elysia({
    prefix: "/admins"
})
    .use(registerAdmin)
    .use(signAdmin)

export default adminPlugin;