export = /* GraphQL */ `
type Query {
    users(page:Int!, take: Int!): UserLimit
    authUser(account: UserAuth!): IsUser
    userById(id: Int): User
    refreshToken:Token
    findUser (name: String!): [User]
}

type Mutation {
    createUser(account: UserInput): User
    createAttendace(id: Int!, studentId: Int): User
    activateUser(id: Int!, token: String!): User
    forgotPassword(email: String!): String
    resetPassword(id: Int!, token: String!, password: String!): String
    updateCurrentUser(id:Int!, data: UserInput): User
    sendBulkSMS(groupName: String, message: String): String
}

type Token {
    token: String
}

type IsUser {
    user: User
    token: String,
}
 type UserLimit {
    users: [User]
    count: Int
    page: Int
    take: Int
 }

type User {
    id: Int
    username: String
    first_name: String
    last_name: String
    email: String
    role: String
    idCard: String
    enabled: Boolean
    class: String
    createdAt: String
    groups: [Group]
}

type Group {
    id: Int
    name: String
    contacts: [Contacts]
}

type Contacts {
    id: Int
    phone: String
}

input UserInput {
    username: String
    first_name: String
    last_name: String
    email: String
    idCard: String
    class: String
    enabled: Boolean
    password: String
}


input UserAuth {
    username: String
    password: String
}
`