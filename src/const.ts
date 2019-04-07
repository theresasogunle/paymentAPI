var bcrypt = require('bcryptjs');

export const salt = bcrypt.genSaltSync(10);