export const typeDefs = /* GraphQL */ `type AggregatePasswordResetCode {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type AggregateVerificationCode {
  count: Int!
}

type AggregateWallet {
  count: Int!
}

type AggregateWalletTransaction {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

enum Gender {
  Male
  Female
}

scalar Long

type Mutation {
  createPasswordResetCode(data: PasswordResetCodeCreateInput!): PasswordResetCode!
  updatePasswordResetCode(data: PasswordResetCodeUpdateInput!, where: PasswordResetCodeWhereUniqueInput!): PasswordResetCode
  updateManyPasswordResetCodes(data: PasswordResetCodeUpdateManyMutationInput!, where: PasswordResetCodeWhereInput): BatchPayload!
  upsertPasswordResetCode(where: PasswordResetCodeWhereUniqueInput!, create: PasswordResetCodeCreateInput!, update: PasswordResetCodeUpdateInput!): PasswordResetCode!
  deletePasswordResetCode(where: PasswordResetCodeWhereUniqueInput!): PasswordResetCode
  deleteManyPasswordResetCodes(where: PasswordResetCodeWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
  createVerificationCode(data: VerificationCodeCreateInput!): VerificationCode!
  updateVerificationCode(data: VerificationCodeUpdateInput!, where: VerificationCodeWhereUniqueInput!): VerificationCode
  updateManyVerificationCodes(data: VerificationCodeUpdateManyMutationInput!, where: VerificationCodeWhereInput): BatchPayload!
  upsertVerificationCode(where: VerificationCodeWhereUniqueInput!, create: VerificationCodeCreateInput!, update: VerificationCodeUpdateInput!): VerificationCode!
  deleteVerificationCode(where: VerificationCodeWhereUniqueInput!): VerificationCode
  deleteManyVerificationCodes(where: VerificationCodeWhereInput): BatchPayload!
  createWallet(data: WalletCreateInput!): Wallet!
  updateWallet(data: WalletUpdateInput!, where: WalletWhereUniqueInput!): Wallet
  updateManyWallets(data: WalletUpdateManyMutationInput!, where: WalletWhereInput): BatchPayload!
  upsertWallet(where: WalletWhereUniqueInput!, create: WalletCreateInput!, update: WalletUpdateInput!): Wallet!
  deleteWallet(where: WalletWhereUniqueInput!): Wallet
  deleteManyWallets(where: WalletWhereInput): BatchPayload!
  createWalletTransaction(data: WalletTransactionCreateInput!): WalletTransaction!
  updateWalletTransaction(data: WalletTransactionUpdateInput!, where: WalletTransactionWhereUniqueInput!): WalletTransaction
  updateManyWalletTransactions(data: WalletTransactionUpdateManyMutationInput!, where: WalletTransactionWhereInput): BatchPayload!
  upsertWalletTransaction(where: WalletTransactionWhereUniqueInput!, create: WalletTransactionCreateInput!, update: WalletTransactionUpdateInput!): WalletTransaction!
  deleteWalletTransaction(where: WalletTransactionWhereUniqueInput!): WalletTransaction
  deleteManyWalletTransactions(where: WalletTransactionWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type PasswordResetCode {
  id: ID!
  code: Int!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
}

type PasswordResetCodeConnection {
  pageInfo: PageInfo!
  edges: [PasswordResetCodeEdge]!
  aggregate: AggregatePasswordResetCode!
}

input PasswordResetCodeCreateInput {
  code: Int!
  deleted: Boolean
  deletedAt: DateTime
  user: UserCreateOneWithoutPasswordResetCodeInput!
}

input PasswordResetCodeCreateOneWithoutUserInput {
  create: PasswordResetCodeCreateWithoutUserInput
  connect: PasswordResetCodeWhereUniqueInput
}

input PasswordResetCodeCreateWithoutUserInput {
  code: Int!
  deleted: Boolean
  deletedAt: DateTime
}

type PasswordResetCodeEdge {
  node: PasswordResetCode!
  cursor: String!
}

enum PasswordResetCodeOrderByInput {
  id_ASC
  id_DESC
  code_ASC
  code_DESC
  deleted_ASC
  deleted_DESC
  deletedAt_ASC
  deletedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PasswordResetCodePreviousValues {
  id: ID!
  code: Int!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type PasswordResetCodeSubscriptionPayload {
  mutation: MutationType!
  node: PasswordResetCode
  updatedFields: [String!]
  previousValues: PasswordResetCodePreviousValues
}

input PasswordResetCodeSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PasswordResetCodeWhereInput
  AND: [PasswordResetCodeSubscriptionWhereInput!]
  OR: [PasswordResetCodeSubscriptionWhereInput!]
  NOT: [PasswordResetCodeSubscriptionWhereInput!]
}

input PasswordResetCodeUpdateInput {
  code: Int
  deleted: Boolean
  deletedAt: DateTime
  user: UserUpdateOneRequiredWithoutPasswordResetCodeInput
}

input PasswordResetCodeUpdateManyMutationInput {
  code: Int
  deleted: Boolean
  deletedAt: DateTime
}

input PasswordResetCodeUpdateOneWithoutUserInput {
  create: PasswordResetCodeCreateWithoutUserInput
  update: PasswordResetCodeUpdateWithoutUserDataInput
  upsert: PasswordResetCodeUpsertWithoutUserInput
  delete: Boolean
  disconnect: Boolean
  connect: PasswordResetCodeWhereUniqueInput
}

input PasswordResetCodeUpdateWithoutUserDataInput {
  code: Int
  deleted: Boolean
  deletedAt: DateTime
}

input PasswordResetCodeUpsertWithoutUserInput {
  update: PasswordResetCodeUpdateWithoutUserDataInput!
  create: PasswordResetCodeCreateWithoutUserInput!
}

input PasswordResetCodeWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  code: Int
  code_not: Int
  code_in: [Int!]
  code_not_in: [Int!]
  code_lt: Int
  code_lte: Int
  code_gt: Int
  code_gte: Int
  deleted: Boolean
  deleted_not: Boolean
  deletedAt: DateTime
  deletedAt_not: DateTime
  deletedAt_in: [DateTime!]
  deletedAt_not_in: [DateTime!]
  deletedAt_lt: DateTime
  deletedAt_lte: DateTime
  deletedAt_gt: DateTime
  deletedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  user: UserWhereInput
  AND: [PasswordResetCodeWhereInput!]
  OR: [PasswordResetCodeWhereInput!]
  NOT: [PasswordResetCodeWhereInput!]
}

input PasswordResetCodeWhereUniqueInput {
  id: ID
}

enum PaymentMedium {
  Easpay
  Bank
  Card
}

type Query {
  passwordResetCode(where: PasswordResetCodeWhereUniqueInput!): PasswordResetCode
  passwordResetCodes(where: PasswordResetCodeWhereInput, orderBy: PasswordResetCodeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [PasswordResetCode]!
  passwordResetCodesConnection(where: PasswordResetCodeWhereInput, orderBy: PasswordResetCodeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PasswordResetCodeConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  verificationCode(where: VerificationCodeWhereUniqueInput!): VerificationCode
  verificationCodes(where: VerificationCodeWhereInput, orderBy: VerificationCodeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [VerificationCode]!
  verificationCodesConnection(where: VerificationCodeWhereInput, orderBy: VerificationCodeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): VerificationCodeConnection!
  wallet(where: WalletWhereUniqueInput!): Wallet
  wallets(where: WalletWhereInput, orderBy: WalletOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Wallet]!
  walletsConnection(where: WalletWhereInput, orderBy: WalletOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): WalletConnection!
  walletTransaction(where: WalletTransactionWhereUniqueInput!): WalletTransaction
  walletTransactions(where: WalletTransactionWhereInput, orderBy: WalletTransactionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [WalletTransaction]!
  walletTransactionsConnection(where: WalletTransactionWhereInput, orderBy: WalletTransactionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): WalletTransactionConnection!
  node(id: ID!): Node
}

type Subscription {
  passwordResetCode(where: PasswordResetCodeSubscriptionWhereInput): PasswordResetCodeSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  verificationCode(where: VerificationCodeSubscriptionWhereInput): VerificationCodeSubscriptionPayload
  wallet(where: WalletSubscriptionWhereInput): WalletSubscriptionPayload
  walletTransaction(where: WalletTransactionSubscriptionWhereInput): WalletTransactionSubscriptionPayload
}

enum TransactionType {
  Debit
  Credit
  Pending
}

type User {
  id: ID!
  fullname: String!
  DOB: DateTime!
  email: String!
  phonenumber: String!
  password: String!
  profile_picture: String
  transaction_pin: String
  gender: Gender!
  verified: Boolean!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  verificationCode: VerificationCode
  passwordResetCode: PasswordResetCode
  wallet: Wallet
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  fullname: String!
  DOB: DateTime!
  email: String!
  phonenumber: String!
  password: String!
  profile_picture: String
  transaction_pin: String
  gender: Gender!
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  verificationCode: VerificationCodeCreateOneWithoutUserInput
  passwordResetCode: PasswordResetCodeCreateOneWithoutUserInput
  wallet: WalletCreateOneWithoutUserInput
}

input UserCreateOneWithoutPasswordResetCodeInput {
  create: UserCreateWithoutPasswordResetCodeInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutVerificationCodeInput {
  create: UserCreateWithoutVerificationCodeInput
  connect: UserWhereUniqueInput
}

input UserCreateOneWithoutWalletInput {
  create: UserCreateWithoutWalletInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutPasswordResetCodeInput {
  fullname: String!
  DOB: DateTime!
  email: String!
  phonenumber: String!
  password: String!
  profile_picture: String
  transaction_pin: String
  gender: Gender!
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  verificationCode: VerificationCodeCreateOneWithoutUserInput
  wallet: WalletCreateOneWithoutUserInput
}

input UserCreateWithoutVerificationCodeInput {
  fullname: String!
  DOB: DateTime!
  email: String!
  phonenumber: String!
  password: String!
  profile_picture: String
  transaction_pin: String
  gender: Gender!
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  passwordResetCode: PasswordResetCodeCreateOneWithoutUserInput
  wallet: WalletCreateOneWithoutUserInput
}

input UserCreateWithoutWalletInput {
  fullname: String!
  DOB: DateTime!
  email: String!
  phonenumber: String!
  password: String!
  profile_picture: String
  transaction_pin: String
  gender: Gender!
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  verificationCode: VerificationCodeCreateOneWithoutUserInput
  passwordResetCode: PasswordResetCodeCreateOneWithoutUserInput
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  fullname_ASC
  fullname_DESC
  DOB_ASC
  DOB_DESC
  email_ASC
  email_DESC
  phonenumber_ASC
  phonenumber_DESC
  password_ASC
  password_DESC
  profile_picture_ASC
  profile_picture_DESC
  transaction_pin_ASC
  transaction_pin_DESC
  gender_ASC
  gender_DESC
  verified_ASC
  verified_DESC
  deleted_ASC
  deleted_DESC
  deletedAt_ASC
  deletedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  fullname: String!
  DOB: DateTime!
  email: String!
  phonenumber: String!
  password: String!
  profile_picture: String
  transaction_pin: String
  gender: Gender!
  verified: Boolean!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  fullname: String
  DOB: DateTime
  email: String
  phonenumber: String
  password: String
  profile_picture: String
  transaction_pin: String
  gender: Gender
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  verificationCode: VerificationCodeUpdateOneWithoutUserInput
  passwordResetCode: PasswordResetCodeUpdateOneWithoutUserInput
  wallet: WalletUpdateOneWithoutUserInput
}

input UserUpdateManyMutationInput {
  fullname: String
  DOB: DateTime
  email: String
  phonenumber: String
  password: String
  profile_picture: String
  transaction_pin: String
  gender: Gender
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
}

input UserUpdateOneRequiredWithoutPasswordResetCodeInput {
  create: UserCreateWithoutPasswordResetCodeInput
  update: UserUpdateWithoutPasswordResetCodeDataInput
  upsert: UserUpsertWithoutPasswordResetCodeInput
  connect: UserWhereUniqueInput
}

input UserUpdateOneRequiredWithoutVerificationCodeInput {
  create: UserCreateWithoutVerificationCodeInput
  update: UserUpdateWithoutVerificationCodeDataInput
  upsert: UserUpsertWithoutVerificationCodeInput
  connect: UserWhereUniqueInput
}

input UserUpdateOneRequiredWithoutWalletInput {
  create: UserCreateWithoutWalletInput
  update: UserUpdateWithoutWalletDataInput
  upsert: UserUpsertWithoutWalletInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutPasswordResetCodeDataInput {
  fullname: String
  DOB: DateTime
  email: String
  phonenumber: String
  password: String
  profile_picture: String
  transaction_pin: String
  gender: Gender
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  verificationCode: VerificationCodeUpdateOneWithoutUserInput
  wallet: WalletUpdateOneWithoutUserInput
}

input UserUpdateWithoutVerificationCodeDataInput {
  fullname: String
  DOB: DateTime
  email: String
  phonenumber: String
  password: String
  profile_picture: String
  transaction_pin: String
  gender: Gender
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  passwordResetCode: PasswordResetCodeUpdateOneWithoutUserInput
  wallet: WalletUpdateOneWithoutUserInput
}

input UserUpdateWithoutWalletDataInput {
  fullname: String
  DOB: DateTime
  email: String
  phonenumber: String
  password: String
  profile_picture: String
  transaction_pin: String
  gender: Gender
  verified: Boolean
  deleted: Boolean
  deletedAt: DateTime
  verificationCode: VerificationCodeUpdateOneWithoutUserInput
  passwordResetCode: PasswordResetCodeUpdateOneWithoutUserInput
}

input UserUpsertWithoutPasswordResetCodeInput {
  update: UserUpdateWithoutPasswordResetCodeDataInput!
  create: UserCreateWithoutPasswordResetCodeInput!
}

input UserUpsertWithoutVerificationCodeInput {
  update: UserUpdateWithoutVerificationCodeDataInput!
  create: UserCreateWithoutVerificationCodeInput!
}

input UserUpsertWithoutWalletInput {
  update: UserUpdateWithoutWalletDataInput!
  create: UserCreateWithoutWalletInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  fullname: String
  fullname_not: String
  fullname_in: [String!]
  fullname_not_in: [String!]
  fullname_lt: String
  fullname_lte: String
  fullname_gt: String
  fullname_gte: String
  fullname_contains: String
  fullname_not_contains: String
  fullname_starts_with: String
  fullname_not_starts_with: String
  fullname_ends_with: String
  fullname_not_ends_with: String
  DOB: DateTime
  DOB_not: DateTime
  DOB_in: [DateTime!]
  DOB_not_in: [DateTime!]
  DOB_lt: DateTime
  DOB_lte: DateTime
  DOB_gt: DateTime
  DOB_gte: DateTime
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  phonenumber: String
  phonenumber_not: String
  phonenumber_in: [String!]
  phonenumber_not_in: [String!]
  phonenumber_lt: String
  phonenumber_lte: String
  phonenumber_gt: String
  phonenumber_gte: String
  phonenumber_contains: String
  phonenumber_not_contains: String
  phonenumber_starts_with: String
  phonenumber_not_starts_with: String
  phonenumber_ends_with: String
  phonenumber_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  profile_picture: String
  profile_picture_not: String
  profile_picture_in: [String!]
  profile_picture_not_in: [String!]
  profile_picture_lt: String
  profile_picture_lte: String
  profile_picture_gt: String
  profile_picture_gte: String
  profile_picture_contains: String
  profile_picture_not_contains: String
  profile_picture_starts_with: String
  profile_picture_not_starts_with: String
  profile_picture_ends_with: String
  profile_picture_not_ends_with: String
  transaction_pin: String
  transaction_pin_not: String
  transaction_pin_in: [String!]
  transaction_pin_not_in: [String!]
  transaction_pin_lt: String
  transaction_pin_lte: String
  transaction_pin_gt: String
  transaction_pin_gte: String
  transaction_pin_contains: String
  transaction_pin_not_contains: String
  transaction_pin_starts_with: String
  transaction_pin_not_starts_with: String
  transaction_pin_ends_with: String
  transaction_pin_not_ends_with: String
  gender: Gender
  gender_not: Gender
  gender_in: [Gender!]
  gender_not_in: [Gender!]
  verified: Boolean
  verified_not: Boolean
  deleted: Boolean
  deleted_not: Boolean
  deletedAt: DateTime
  deletedAt_not: DateTime
  deletedAt_in: [DateTime!]
  deletedAt_not_in: [DateTime!]
  deletedAt_lt: DateTime
  deletedAt_lte: DateTime
  deletedAt_gt: DateTime
  deletedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  verificationCode: VerificationCodeWhereInput
  passwordResetCode: PasswordResetCodeWhereInput
  wallet: WalletWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
  phonenumber: String
}

type VerificationCode {
  id: ID!
  code: Int!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
}

type VerificationCodeConnection {
  pageInfo: PageInfo!
  edges: [VerificationCodeEdge]!
  aggregate: AggregateVerificationCode!
}

input VerificationCodeCreateInput {
  code: Int!
  deleted: Boolean
  deletedAt: DateTime
  user: UserCreateOneWithoutVerificationCodeInput!
}

input VerificationCodeCreateOneWithoutUserInput {
  create: VerificationCodeCreateWithoutUserInput
  connect: VerificationCodeWhereUniqueInput
}

input VerificationCodeCreateWithoutUserInput {
  code: Int!
  deleted: Boolean
  deletedAt: DateTime
}

type VerificationCodeEdge {
  node: VerificationCode!
  cursor: String!
}

enum VerificationCodeOrderByInput {
  id_ASC
  id_DESC
  code_ASC
  code_DESC
  deleted_ASC
  deleted_DESC
  deletedAt_ASC
  deletedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type VerificationCodePreviousValues {
  id: ID!
  code: Int!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type VerificationCodeSubscriptionPayload {
  mutation: MutationType!
  node: VerificationCode
  updatedFields: [String!]
  previousValues: VerificationCodePreviousValues
}

input VerificationCodeSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: VerificationCodeWhereInput
  AND: [VerificationCodeSubscriptionWhereInput!]
  OR: [VerificationCodeSubscriptionWhereInput!]
  NOT: [VerificationCodeSubscriptionWhereInput!]
}

input VerificationCodeUpdateInput {
  code: Int
  deleted: Boolean
  deletedAt: DateTime
  user: UserUpdateOneRequiredWithoutVerificationCodeInput
}

input VerificationCodeUpdateManyMutationInput {
  code: Int
  deleted: Boolean
  deletedAt: DateTime
}

input VerificationCodeUpdateOneWithoutUserInput {
  create: VerificationCodeCreateWithoutUserInput
  update: VerificationCodeUpdateWithoutUserDataInput
  upsert: VerificationCodeUpsertWithoutUserInput
  delete: Boolean
  disconnect: Boolean
  connect: VerificationCodeWhereUniqueInput
}

input VerificationCodeUpdateWithoutUserDataInput {
  code: Int
  deleted: Boolean
  deletedAt: DateTime
}

input VerificationCodeUpsertWithoutUserInput {
  update: VerificationCodeUpdateWithoutUserDataInput!
  create: VerificationCodeCreateWithoutUserInput!
}

input VerificationCodeWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  code: Int
  code_not: Int
  code_in: [Int!]
  code_not_in: [Int!]
  code_lt: Int
  code_lte: Int
  code_gt: Int
  code_gte: Int
  deleted: Boolean
  deleted_not: Boolean
  deletedAt: DateTime
  deletedAt_not: DateTime
  deletedAt_in: [DateTime!]
  deletedAt_not_in: [DateTime!]
  deletedAt_lt: DateTime
  deletedAt_lte: DateTime
  deletedAt_gt: DateTime
  deletedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  user: UserWhereInput
  AND: [VerificationCodeWhereInput!]
  OR: [VerificationCodeWhereInput!]
  NOT: [VerificationCodeWhereInput!]
}

input VerificationCodeWhereUniqueInput {
  id: ID
}

type Wallet {
  id: ID!
  amount: Float!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
  wallet_transactions(where: WalletTransactionWhereInput, orderBy: WalletTransactionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [WalletTransaction!]
}

type WalletConnection {
  pageInfo: PageInfo!
  edges: [WalletEdge]!
  aggregate: AggregateWallet!
}

input WalletCreateInput {
  amount: Float!
  deleted: Boolean
  deletedAt: DateTime
  user: UserCreateOneWithoutWalletInput!
  wallet_transactions: WalletTransactionCreateManyWithoutWalletInput
}

input WalletCreateOneWithoutUserInput {
  create: WalletCreateWithoutUserInput
  connect: WalletWhereUniqueInput
}

input WalletCreateOneWithoutWallet_transactionsInput {
  create: WalletCreateWithoutWallet_transactionsInput
  connect: WalletWhereUniqueInput
}

input WalletCreateWithoutUserInput {
  amount: Float!
  deleted: Boolean
  deletedAt: DateTime
  wallet_transactions: WalletTransactionCreateManyWithoutWalletInput
}

input WalletCreateWithoutWallet_transactionsInput {
  amount: Float!
  deleted: Boolean
  deletedAt: DateTime
  user: UserCreateOneWithoutWalletInput!
}

type WalletEdge {
  node: Wallet!
  cursor: String!
}

enum WalletOrderByInput {
  id_ASC
  id_DESC
  amount_ASC
  amount_DESC
  deleted_ASC
  deleted_DESC
  deletedAt_ASC
  deletedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type WalletPreviousValues {
  id: ID!
  amount: Float!
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type WalletSubscriptionPayload {
  mutation: MutationType!
  node: Wallet
  updatedFields: [String!]
  previousValues: WalletPreviousValues
}

input WalletSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: WalletWhereInput
  AND: [WalletSubscriptionWhereInput!]
  OR: [WalletSubscriptionWhereInput!]
  NOT: [WalletSubscriptionWhereInput!]
}

type WalletTransaction {
  id: ID!
  amount: Float!
  type: TransactionType!
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String!
  fee: Float
  total: Float
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  wallet: Wallet!
}

type WalletTransactionConnection {
  pageInfo: PageInfo!
  edges: [WalletTransactionEdge]!
  aggregate: AggregateWalletTransaction!
}

input WalletTransactionCreateInput {
  amount: Float!
  type: TransactionType!
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String!
  fee: Float
  total: Float
  deleted: Boolean
  deletedAt: DateTime
  wallet: WalletCreateOneWithoutWallet_transactionsInput!
}

input WalletTransactionCreateManyWithoutWalletInput {
  create: [WalletTransactionCreateWithoutWalletInput!]
  connect: [WalletTransactionWhereUniqueInput!]
}

input WalletTransactionCreateWithoutWalletInput {
  amount: Float!
  type: TransactionType!
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String!
  fee: Float
  total: Float
  deleted: Boolean
  deletedAt: DateTime
}

type WalletTransactionEdge {
  node: WalletTransaction!
  cursor: String!
}

enum WalletTransactionOrderByInput {
  id_ASC
  id_DESC
  amount_ASC
  amount_DESC
  type_ASC
  type_DESC
  transactionReference_ASC
  transactionReference_DESC
  medium_ASC
  medium_DESC
  mediumName_ASC
  mediumName_DESC
  mediumNumber_ASC
  mediumNumber_DESC
  description_ASC
  description_DESC
  fee_ASC
  fee_DESC
  total_ASC
  total_DESC
  deleted_ASC
  deleted_DESC
  deletedAt_ASC
  deletedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type WalletTransactionPreviousValues {
  id: ID!
  amount: Float!
  type: TransactionType!
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String!
  fee: Float
  total: Float
  deleted: Boolean!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

input WalletTransactionScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  amount: Float
  amount_not: Float
  amount_in: [Float!]
  amount_not_in: [Float!]
  amount_lt: Float
  amount_lte: Float
  amount_gt: Float
  amount_gte: Float
  type: TransactionType
  type_not: TransactionType
  type_in: [TransactionType!]
  type_not_in: [TransactionType!]
  transactionReference: String
  transactionReference_not: String
  transactionReference_in: [String!]
  transactionReference_not_in: [String!]
  transactionReference_lt: String
  transactionReference_lte: String
  transactionReference_gt: String
  transactionReference_gte: String
  transactionReference_contains: String
  transactionReference_not_contains: String
  transactionReference_starts_with: String
  transactionReference_not_starts_with: String
  transactionReference_ends_with: String
  transactionReference_not_ends_with: String
  medium: PaymentMedium
  medium_not: PaymentMedium
  medium_in: [PaymentMedium!]
  medium_not_in: [PaymentMedium!]
  mediumName: String
  mediumName_not: String
  mediumName_in: [String!]
  mediumName_not_in: [String!]
  mediumName_lt: String
  mediumName_lte: String
  mediumName_gt: String
  mediumName_gte: String
  mediumName_contains: String
  mediumName_not_contains: String
  mediumName_starts_with: String
  mediumName_not_starts_with: String
  mediumName_ends_with: String
  mediumName_not_ends_with: String
  mediumNumber: String
  mediumNumber_not: String
  mediumNumber_in: [String!]
  mediumNumber_not_in: [String!]
  mediumNumber_lt: String
  mediumNumber_lte: String
  mediumNumber_gt: String
  mediumNumber_gte: String
  mediumNumber_contains: String
  mediumNumber_not_contains: String
  mediumNumber_starts_with: String
  mediumNumber_not_starts_with: String
  mediumNumber_ends_with: String
  mediumNumber_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  fee: Float
  fee_not: Float
  fee_in: [Float!]
  fee_not_in: [Float!]
  fee_lt: Float
  fee_lte: Float
  fee_gt: Float
  fee_gte: Float
  total: Float
  total_not: Float
  total_in: [Float!]
  total_not_in: [Float!]
  total_lt: Float
  total_lte: Float
  total_gt: Float
  total_gte: Float
  deleted: Boolean
  deleted_not: Boolean
  deletedAt: DateTime
  deletedAt_not: DateTime
  deletedAt_in: [DateTime!]
  deletedAt_not_in: [DateTime!]
  deletedAt_lt: DateTime
  deletedAt_lte: DateTime
  deletedAt_gt: DateTime
  deletedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [WalletTransactionScalarWhereInput!]
  OR: [WalletTransactionScalarWhereInput!]
  NOT: [WalletTransactionScalarWhereInput!]
}

type WalletTransactionSubscriptionPayload {
  mutation: MutationType!
  node: WalletTransaction
  updatedFields: [String!]
  previousValues: WalletTransactionPreviousValues
}

input WalletTransactionSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: WalletTransactionWhereInput
  AND: [WalletTransactionSubscriptionWhereInput!]
  OR: [WalletTransactionSubscriptionWhereInput!]
  NOT: [WalletTransactionSubscriptionWhereInput!]
}

input WalletTransactionUpdateInput {
  amount: Float
  type: TransactionType
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String
  fee: Float
  total: Float
  deleted: Boolean
  deletedAt: DateTime
  wallet: WalletUpdateOneRequiredWithoutWallet_transactionsInput
}

input WalletTransactionUpdateManyDataInput {
  amount: Float
  type: TransactionType
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String
  fee: Float
  total: Float
  deleted: Boolean
  deletedAt: DateTime
}

input WalletTransactionUpdateManyMutationInput {
  amount: Float
  type: TransactionType
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String
  fee: Float
  total: Float
  deleted: Boolean
  deletedAt: DateTime
}

input WalletTransactionUpdateManyWithoutWalletInput {
  create: [WalletTransactionCreateWithoutWalletInput!]
  delete: [WalletTransactionWhereUniqueInput!]
  connect: [WalletTransactionWhereUniqueInput!]
  disconnect: [WalletTransactionWhereUniqueInput!]
  update: [WalletTransactionUpdateWithWhereUniqueWithoutWalletInput!]
  upsert: [WalletTransactionUpsertWithWhereUniqueWithoutWalletInput!]
  deleteMany: [WalletTransactionScalarWhereInput!]
  updateMany: [WalletTransactionUpdateManyWithWhereNestedInput!]
}

input WalletTransactionUpdateManyWithWhereNestedInput {
  where: WalletTransactionScalarWhereInput!
  data: WalletTransactionUpdateManyDataInput!
}

input WalletTransactionUpdateWithoutWalletDataInput {
  amount: Float
  type: TransactionType
  transactionReference: String
  medium: PaymentMedium
  mediumName: String
  mediumNumber: String
  description: String
  fee: Float
  total: Float
  deleted: Boolean
  deletedAt: DateTime
}

input WalletTransactionUpdateWithWhereUniqueWithoutWalletInput {
  where: WalletTransactionWhereUniqueInput!
  data: WalletTransactionUpdateWithoutWalletDataInput!
}

input WalletTransactionUpsertWithWhereUniqueWithoutWalletInput {
  where: WalletTransactionWhereUniqueInput!
  update: WalletTransactionUpdateWithoutWalletDataInput!
  create: WalletTransactionCreateWithoutWalletInput!
}

input WalletTransactionWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  amount: Float
  amount_not: Float
  amount_in: [Float!]
  amount_not_in: [Float!]
  amount_lt: Float
  amount_lte: Float
  amount_gt: Float
  amount_gte: Float
  type: TransactionType
  type_not: TransactionType
  type_in: [TransactionType!]
  type_not_in: [TransactionType!]
  transactionReference: String
  transactionReference_not: String
  transactionReference_in: [String!]
  transactionReference_not_in: [String!]
  transactionReference_lt: String
  transactionReference_lte: String
  transactionReference_gt: String
  transactionReference_gte: String
  transactionReference_contains: String
  transactionReference_not_contains: String
  transactionReference_starts_with: String
  transactionReference_not_starts_with: String
  transactionReference_ends_with: String
  transactionReference_not_ends_with: String
  medium: PaymentMedium
  medium_not: PaymentMedium
  medium_in: [PaymentMedium!]
  medium_not_in: [PaymentMedium!]
  mediumName: String
  mediumName_not: String
  mediumName_in: [String!]
  mediumName_not_in: [String!]
  mediumName_lt: String
  mediumName_lte: String
  mediumName_gt: String
  mediumName_gte: String
  mediumName_contains: String
  mediumName_not_contains: String
  mediumName_starts_with: String
  mediumName_not_starts_with: String
  mediumName_ends_with: String
  mediumName_not_ends_with: String
  mediumNumber: String
  mediumNumber_not: String
  mediumNumber_in: [String!]
  mediumNumber_not_in: [String!]
  mediumNumber_lt: String
  mediumNumber_lte: String
  mediumNumber_gt: String
  mediumNumber_gte: String
  mediumNumber_contains: String
  mediumNumber_not_contains: String
  mediumNumber_starts_with: String
  mediumNumber_not_starts_with: String
  mediumNumber_ends_with: String
  mediumNumber_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  fee: Float
  fee_not: Float
  fee_in: [Float!]
  fee_not_in: [Float!]
  fee_lt: Float
  fee_lte: Float
  fee_gt: Float
  fee_gte: Float
  total: Float
  total_not: Float
  total_in: [Float!]
  total_not_in: [Float!]
  total_lt: Float
  total_lte: Float
  total_gt: Float
  total_gte: Float
  deleted: Boolean
  deleted_not: Boolean
  deletedAt: DateTime
  deletedAt_not: DateTime
  deletedAt_in: [DateTime!]
  deletedAt_not_in: [DateTime!]
  deletedAt_lt: DateTime
  deletedAt_lte: DateTime
  deletedAt_gt: DateTime
  deletedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  wallet: WalletWhereInput
  AND: [WalletTransactionWhereInput!]
  OR: [WalletTransactionWhereInput!]
  NOT: [WalletTransactionWhereInput!]
}

input WalletTransactionWhereUniqueInput {
  id: ID
  transactionReference: String
}

input WalletUpdateInput {
  amount: Float
  deleted: Boolean
  deletedAt: DateTime
  user: UserUpdateOneRequiredWithoutWalletInput
  wallet_transactions: WalletTransactionUpdateManyWithoutWalletInput
}

input WalletUpdateManyMutationInput {
  amount: Float
  deleted: Boolean
  deletedAt: DateTime
}

input WalletUpdateOneRequiredWithoutWallet_transactionsInput {
  create: WalletCreateWithoutWallet_transactionsInput
  update: WalletUpdateWithoutWallet_transactionsDataInput
  upsert: WalletUpsertWithoutWallet_transactionsInput
  connect: WalletWhereUniqueInput
}

input WalletUpdateOneWithoutUserInput {
  create: WalletCreateWithoutUserInput
  update: WalletUpdateWithoutUserDataInput
  upsert: WalletUpsertWithoutUserInput
  delete: Boolean
  disconnect: Boolean
  connect: WalletWhereUniqueInput
}

input WalletUpdateWithoutUserDataInput {
  amount: Float
  deleted: Boolean
  deletedAt: DateTime
  wallet_transactions: WalletTransactionUpdateManyWithoutWalletInput
}

input WalletUpdateWithoutWallet_transactionsDataInput {
  amount: Float
  deleted: Boolean
  deletedAt: DateTime
  user: UserUpdateOneRequiredWithoutWalletInput
}

input WalletUpsertWithoutUserInput {
  update: WalletUpdateWithoutUserDataInput!
  create: WalletCreateWithoutUserInput!
}

input WalletUpsertWithoutWallet_transactionsInput {
  update: WalletUpdateWithoutWallet_transactionsDataInput!
  create: WalletCreateWithoutWallet_transactionsInput!
}

input WalletWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  amount: Float
  amount_not: Float
  amount_in: [Float!]
  amount_not_in: [Float!]
  amount_lt: Float
  amount_lte: Float
  amount_gt: Float
  amount_gte: Float
  deleted: Boolean
  deleted_not: Boolean
  deletedAt: DateTime
  deletedAt_not: DateTime
  deletedAt_in: [DateTime!]
  deletedAt_not_in: [DateTime!]
  deletedAt_lt: DateTime
  deletedAt_lte: DateTime
  deletedAt_gt: DateTime
  deletedAt_gte: DateTime
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  user: UserWhereInput
  wallet_transactions_every: WalletTransactionWhereInput
  wallet_transactions_some: WalletTransactionWhereInput
  wallet_transactions_none: WalletTransactionWhereInput
  AND: [WalletWhereInput!]
  OR: [WalletWhereInput!]
  NOT: [WalletWhereInput!]
}

input WalletWhereUniqueInput {
  id: ID
}
`