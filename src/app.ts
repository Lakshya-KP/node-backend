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
import { UserRepository } from "./modules/users/repositories/user.repository.js";
import { RefreshTokenService } from "./common/services/refresh-token.service.js";
import { RefreshTokenRepository } from "./modules/auth/repositories/refresh-token.repository.js";
import { TaskRepository } from "./modules/tasks/task.repository.js";

const app = express();
app.use(express.json());

const jwtService = new JwtService();
const refreshTokenRepository = new RefreshTokenRepository();
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const authenticationMiddleware = createAuthenticationMiddleware(jwtService);

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);
app.use("/tasks", createTaskRouter(taskController, authenticationMiddleware));

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const authService = new AuthService(jwtService, refreshTokenService, userService);
const authController = new AuthController(authService);
app.use("/auth", createAuthRouter(authController, authenticationMiddleware));

const userController = new UserController(userService);
app.use("/user", createUserRouter(userController, authenticationMiddleware))

app.use(errorMiddleware)

export default app;
