const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');

class AlbumsLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumlike(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like Gagal!');
    }
    await this._cacheService.delete(`redisAlbum:${albumId}`);
    return result.rows[0].id;
  }

  async unlike(credentialId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [credentialId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal melakukan like');
    }
    await this._cacheService.delete(`redisAlbum:${albumId}`);
    return result.rows.length;
  }

  async checkAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async checkLike(credentialId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [credentialId, albumId],
    };
    const result = await this._pool.query(query);
    return result.rows.length;
  }

  async countLike(albumid) {
    try {
      const redis = await this._cacheService.get(`redisAlbum:${albumid}`);
      return {
        count: JSON.parse(redis),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumid],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError('Album tidak ditemukan');
      }
      await this._cacheService.set(`redisAlbum:${albumid}`, JSON.stringify(result.rows.length));
      return {
        count: result.rows.length,
        source: 'db',
      };
    }
  }
}

module.exports = AlbumsLikeService;
