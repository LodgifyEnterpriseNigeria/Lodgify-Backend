import Elysia from "elysia";
import createTask from "./controllers/createTask.route";

const taskPlugin = new Elysia({
    prefix: "/task"
})
    .use(createTask)


export default taskPlugin