require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumServices = require('./service/postgres/AlbumsService');
const SongServices = require('./service/postgres/SongsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./service/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const init = async () => {
  const albumServices = new AlbumServices();
  const songServices = new SongServices();
  const userServices = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumServices,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userServices,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        userServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
