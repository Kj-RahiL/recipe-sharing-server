import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundRoute from './app/middlewares/notFound';


const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send(`
      <html>
        <head>
          <title>Recipe Sharing Community Server</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .content {
              text-align: justify;
              font-size: 36px;
              width: 80%; 
            }
          </style>
        </head>
        <body>
          <div class="content">
            Boom💥💥💥!! Recipe Sharing Community is running...
          </div>
        </body>
      </html>
    `);
});

app.use(globalErrorHandler);

// not found route error
app.use(notFoundRoute);

export default app;
