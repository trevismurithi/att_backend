module.exports = /* GraphQL */ `
type Query {
    students: [Student],
    studentById(id: Int!): Student
}

type Mutation {
    createStudent (student: StudentInput!): Student
    createProfile (id: Int!, profile: ProfileInput!): Student
}
`

