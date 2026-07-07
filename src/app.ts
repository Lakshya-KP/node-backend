import express from "express";
import { createTaskRouter } from "./modules/tasks/task.routes.js";
import { TaskService } from "./modules/tasks/task.service.js";
import { TaskController } from "./modules/tasks/task.controller.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { createAuthRouter } from "./modules/auth/auth.route.js";
import { JwtService } from "./common/services/jwt.service.js";
import { createAuthenticationMiddleware } from "./common/middleware/authentication.middleware.js";
import { createUserRouter } from "./modules/users/user.routes.js";
import { UserService } from "./modules/users/user.service.js";
import { UserController } from "./modules/users/user.controller.js";
import { RefreshTokenService } from "./common/services/refresh-token.service.js";

const app = express();
app.use(express.json());

const jwtService = new JwtService();
const refreshTokenService = new RefreshTokenService();
const authenticationMiddleware = createAuthenticationMiddleware(jwtService);

const taskService = new TaskService();
const taskController = new TaskController(taskService);
app.use("/tasks", createTaskRouter(taskController, authenticationMiddleware));

const authService = new AuthService(jwtService, refreshTokenService);
const authController = new AuthController(authService);
app.use("/auth", createAuthRouter(authController, authenticationMiddleware));

const userService = new UserService();
const userController = new UserController(userService);
app.use("/user", createUserRouter(userController, authenticationMiddleware))

app.use(errorMiddleware)

export default app;
