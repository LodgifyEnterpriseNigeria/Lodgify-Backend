import Elysia from "elysia"
import registerUser from "./controllers/registerUser.route"
import signUser from "./controllers/signUser.route";
import socialAuth from "./controllers/socialAuth.route";
import adminHandleUsers from "./controllers/adminHandleUsers.route";

const userPlugin = new Elysia({
    prefix: "/users"
})
    .use(registerUser)
    .use(signUser)
    .use(socialAuth)
    .use(adminHandleUsers)


export default userPlugin;