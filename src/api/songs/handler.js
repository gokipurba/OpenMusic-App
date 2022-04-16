const ClientError = require("../../exception/ClientError");

class SongsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
        
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
        
    }
    async postSongHandler (request, h) {
        try {
            this._validator.validateSongPayload(request.payload)
            const {title, year, genre, performer, duration, albumId} = request.payload;
            const song_id = await this._service.addSong({title, year, genre, performer, duration, albumId});
            const response = h.response({
                status: 'success',
                data:{
                    songId : song_id,
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                console.log(error);
                return response;
            }
            
            // Server Error!
            const response = h.response({
            status: 'fail',
            message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;            
        }   
    }

    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success', 
            data : {
                songs,
            },
        };
    }

    async getSongByIdHandler(request,h) {
        try {
            const { id } = request.params;
            const song =  await this._service.getSongById(id);
            const response = h.response({
                status  : 'success',
                data    : {
                    song,
                }
            });
            response.code(200);
            return response; //default sudah pasti 200
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                console.log(error);
                return response;
            }
            
            // Server Error!
            const response = h.response({
            status: 'fail',
            message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;         
        }
    }
    
    async putSongByIdHandler(request,h){
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;
            await this._service.editSongById(id, request.payload);
            const response = h.response({
                status : "success",
                message: "Song berhasil diubah :)",
            })
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            
            // Server Error!
            const response = h.response({
            status: 'fail',
            message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;    
        } 
    }

    async deleteSongByIdHandler(request,h){
        try{
            const { id } = request.params;
            await this._service.deleteSongById(id);
            return {
                status: 'success',
                message: 'Song berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                status: 'fail',
                message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }   
    }

}

module.exports = SongsHandler;