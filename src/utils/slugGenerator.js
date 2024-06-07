const { v4: uuidv4 } = require('uuid');

exports.generateSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');