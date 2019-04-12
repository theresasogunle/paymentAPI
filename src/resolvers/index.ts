let _ = require("lodash");

import userResolver from "./user.resolver";
import walletResolver from "./wallet.resolver";

const resolvers = _.merge(userResolver, walletResolver);

export default resolvers;
