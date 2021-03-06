const InvariantError = require('../../exception/InvariantError');
const { songPayloadSchema } = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const resultvalidator = songPayloadSchema.validate(payload);
    if (resultvalidator.error) {
      throw new InvariantError(resultvalidator.error.message);
    }
  },
};

module.exports = SongsValidator;
