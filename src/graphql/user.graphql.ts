export = /* GraphQL */ `
type Query {
    users: [User]
    authUser(account: UserAuth!): IsUser
    userById(id: Int!): User
    refreshToken:Token
}

type Mutation {
    createUser(account: UserInput): User
    createAttendace(id: Int!, studentId: Int): User
    activateUser(id: Int!, token: String!): User
    forgotPassword(email: String!): String
    resetPassword(id: Int!, token: String!, password: String!): String
}

type Token {
    token: String
}

type IsUser {
    user: User
    token: String,
}

type User {
    id: Int
    username: String
    first_name: String
    last_name: String
    email: String
    role: String
    birthday: String
    class: String
    createdAt: String
}

input UserInput {
    username: String
    first_name: String
    last_name: String
    email: String
    birthday: String
    class: String
    password: String
}


input UserAuth {
    username: String
    password: String
}
`