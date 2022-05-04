const ClientError = require('../../exception/ClientError');

class AlbumHandler {
  constructor(service) {
    this._sercive = service;

    this.postAlbumLikeUnlikeHandler = this.postAlbumLikeUnlikeHandler.bind(this);
    this.getCountLike = this.getCountLike.bind(this);
  }

  async postAlbumLikeUnlikeHandler(request, h) {
    try {
      const idAlbum = request.params.id;
      const { id: credentialId } = request.auth.credentials;
      await this._sercive.checkAlbum(idAlbum);
      const alreadylike = await this._sercive.checkLike(credentialId, idAlbum);
      if (!alreadylike) {
        const likeId = await this._sercive.addAlbumlike(credentialId, idAlbum);
        const response = h.response({
          status: 'success',
          message: `${likeId}`,
        });

        response.code(201);
        return response;
      }
      await this._sercive.unlike(credentialId, idAlbum);
      const response = h.response({
        status: 'success',
        message: 'Unlike berhasil',
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

  async getCountLike(request, h) {
    try {
      const idAlbum = request.params.id;
      const countLike = await this._sercive.countLike(idAlbum);
      const response = h.response({
        status: 'success',
        data: { likes: countLike.count },
      });
      response.header('X-Data-Source', countLike.source);
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
}

module.exports = AlbumHandler;
