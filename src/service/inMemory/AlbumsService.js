const { nanoid } = require("nanoid");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");

class AlbumServices {
    constructor () {
        this._albums = [];
    }

    addAlbum({ name, year }) {
        const id = 'album-'+nanoid(16);
        const newAlbum = {
            id, name, year
        }
        
        this._albums.push(newAlbum);
        const isSuccess = this._albums.filter((album) => album.id === id).length > 0;
        if (!isSuccess) {
            throw new InvariantError('Album gagal ditambahkan');
        }
        return id;
    }

    getAlbumById(id){
        const album = this._albums.filter((album) => album.id === id)[0];
    
        if(!album){
          throw new NotFoundError("Album tidak ditemukan");
        }
        return album;
    }

    editAlbumById(id, { name,year }){
        const index_album = this._albums.findIndex((album) => album.id === id);

        if(index_album === -1){
            throw new NotFoundError("Album tidak ditemukan");
        }
        
        this._albums[index_album] = {
            ...this._albums[index_album],
            name,
            year,
        };
    }

    deleteAlbumById(id) {
        const index_album = this._albums.findIndex((album) => album.id === id);
        if (index_album === -1){
            throw new NotFoundError("Album tidak ditemukan");
        }

        this._albums.splice(index_album,1);
    }
}

module.exports = AlbumServices;