const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');

class SongServices {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const newsong = {
      id, title, year, performer, genre, duration, albumId,
    };

    this._songs.push(newsong);
    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError('song gagal ditambahkan');
    }
    return id;
  }

  getSongs() {
    return this._songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  getSongById(id) {
    const song = this._songs.filter((getsong) => getsong.id === id)[0];

    if (!song) {
      throw new NotFoundError('song tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const editIndexSong = this._songs.findIndex((song) => song.id === id);

    if (editIndexSong === -1) {
      throw new NotFoundError('song tidak ditemukan');
    }

    this._songs[editIndexSong] = {
      ...this._songs[editIndexSong],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const deleteIndexSong = this._songs.findIndex((song) => song.id === id);
    if (deleteIndexSong === -1) {
      throw new NotFoundError('song tidak ditemukan');
    }

    this._songs.splice(deleteIndexSong, 1);
  }
}

module.exports = SongServices;
