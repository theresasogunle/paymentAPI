let _ = require("lodash");

import userResolver from "./user.resolver";

const resolvers = _.merge(userResolver);

export default resolvers;
