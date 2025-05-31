import Elysia from "elysia"
import registerUser from "./controllers/registerUser.route"
import signUser from "./controllers/signUser.route";

const userPlugin = new Elysia({
    prefix: "/users"
})
    .use(registerUser)
    .use(signUser)


export default userPlugin;