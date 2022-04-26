const mapDBTOModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumid,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: albumid,
});

const mapSongDBToModel = ({ song_id, song_title, performer }) => ({
  id: song_id,
  title: song_title,
  performer,
});

const mapPlaylistDBToModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapDBTOModel, mapSongDBToModel, mapPlaylistDBToModel };
