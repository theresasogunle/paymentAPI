let _ = require("lodash");

import bankResolver from "./bank.resolver";
import userResolver from "./user.resolver";
import walletResolver from "./wallet.resolver";

const resolvers = _.merge(userResolver, walletResolver, bankResolver);

export default resolvers;
