import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';
import * as swaggerUI from 'swagger-ui-express';
import { config } from './common/config.js';
import { UserController } from './resources/users/user.controller.js';

class Server {
  constructor() {
    this.app = express();
    this.swaggerDocument = YAML.load(
      path.join(dirname(fileURLToPath(import.meta.url)), '../doc/api.yaml')
    );
    this.userController = new UserController();
    this.routes();
  }

  routes() {
    this.app.use(express.json());

    this.app.use(
      '/doc',
      swaggerUI.serve,
      swaggerUI.setup(this.swaggerDocument)
    );

    this.app.use('/', (req, res, next) => {
      if (req.originalUrl === '/') {
        res.send('Service is running!');
        return;
      }
      next();
    });

    this.app.use('/users', this.userController.router);
  }

  start() {
    this.app.listen(config.PORT, () =>
      console.log(`App is running on http://localhost:${config.PORT}`)
    );
  }
}

const server = new Server();
server.start();
