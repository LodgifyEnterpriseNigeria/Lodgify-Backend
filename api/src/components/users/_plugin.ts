import Elysia from "elysia"
import registerUser from "./controllers/registerUser.route"
import signUser from "./controllers/signUser.route";
import socialAuth from "./controllers/socialAuth.route";

const userPlugin = new Elysia({
    prefix: "/users"
})
    .use(registerUser)
    .use(signUser)
    .use(socialAuth)


export default userPlugin;