const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');
const { mapPlaylistDBToModel, mapSongDBToModel } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylists() {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan!');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengaccess resource ini!');
    }
  }

  async addSongPlaylist(playlistId, songId) {
    const id = `playlist_songs ${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Songs Gagal ditambakan kedalam playlist!');
    }
  }

  async getSongsPlaylistId(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username, songs.id as song_id, songs.title as song_title, songs.performer FROM playlists
            LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
            LEFT JOIN songs ON songs.id = playlist_songs.song_id
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlits tidak ditemukan');
    }

    const songs = result.rows.map(mapSongDBToModel);
    const playlist = result.rows.map(mapPlaylistDBToModel)[0];
    return { ...playlist, songs };
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id =$1 AND song_id =$2 RETURNING playlist_id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu tidak berhasil dihapus atau tidak ada, dari playlist');
    }
  }

  async verifySong(songId) {
    const query = {
      text: 'SELECT FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ada!');
    }
  }
}

module.exports = PlaylistsService;
