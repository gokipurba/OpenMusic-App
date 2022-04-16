const { nanoid } = require("nanoid");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");

class SongServices {
    constructor () {
        this._songs = [];
    }

    addSong({ title, year, genre, performer, duration, albumId }) {
        const id = 'song-'+nanoid(16);
        const newsong = {
            id,title, year, performer, genre, duration, albumId
        }
        
        this._songs.push(newsong);
        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
        if (!isSuccess) {
            throw new InvariantError('song gagal ditambahkan');
        }
        return id;
    }

    getSongs(){
        return this._songs.map(song => ({id:song.id,title: song.title,performer: song.performer}));
    } 

    getSongById(id){
        const song = this._songs.filter((song) => song.id === id)[0];
    
        if(!song){
          throw new NotFoundError("song tidak ditemukan");
        }
        return song;
    }

    editSongById(id, { title, year, genre, performer, duration, albumId }){
        const index_song = this._songs.findIndex((song) => song.id === id);

        if(index_song === -1){
            throw new NotFoundError("song tidak ditemukan");
        }
        
        this._songs[index_song] = {
            ...this._songs[index_song],
            title,
            year,
            genre,
            performer,
            duration, 
            albumId,
        };
    }

    deleteSongById(id) {
        const index_song = this._songs.findIndex((song) => song.id === id);
        if (index_song === -1){
            throw new NotFoundError("song tidak ditemukan");
        }

        this._songs.splice(index_song,1);
    }
}

module.exports = SongServices;