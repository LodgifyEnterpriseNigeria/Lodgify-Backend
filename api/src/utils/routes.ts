import Elysia from "elysia";
import authPlugin from "../components/auth/_plugin";
import userPlugin from "../components/users/_plugin";
import adminPlugin from "../components/admin/_plugin";
import notificationsPlugin from "../components/notification/_plugin";
import referalPlugin from "../components/referral/_plugin";
import taskPlugin from "../components/task/_plugin";

const routes = new Elysia()
    .get("/", () => "Server is up and running 🦊", { detail: { tags: ['Server Status'] } })
    .use(authPlugin)
    .use(adminPlugin)
    .use(userPlugin)
    .use(notificationsPlugin)
    .use(referalPlugin)
    .use(taskPlugin)


export default routes 