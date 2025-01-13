import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import singleChatHandler from './app/utils/chat';
import { Server } from 'socket.io';
import http from 'http';

async function main() {
  
    const server = http.createServer(app);

    // Initialize socket.io
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
    // Attach Chat Handlers
    singleChatHandler(io);

    await mongoose.connect(config.database_url as string);
    server.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
 

  process.on('unhandledRejection', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    }
    process.exit(1);
  });

  process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
  });
}

main();
