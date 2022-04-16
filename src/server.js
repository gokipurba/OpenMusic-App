const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumServices = require('./service/inMemory/AlbumsService');
const SongServices = require('./service/inMemory/SongsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const init = async () => {
    const albumServices = new AlbumServices();
    const songServices = new SongServices
    const server = Hapi.server({
        port : 5000,
        host : "localhost",
        routes: {
            cors : {
                origin : ['*'],
            }
        }
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumServices,
                validator: AlbumsValidator
            },
        },
        {
            plugin: songs,
            options: {
                service: songServices,
                validator: SongsValidator
            },
        },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init ();