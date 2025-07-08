import Elysia from "elysia";
import createTask from "./controllers/createTask.route";
import adminHandleTask from "./controllers/adminHandleTask.route";
import userHandleTask from "./controllers/userHandleTask.route";

const taskPlugin = new Elysia({
    prefix: "/task"
})
    .use(createTask)
    .use(adminHandleTask)
    .use(userHandleTask)

export default taskPlugin