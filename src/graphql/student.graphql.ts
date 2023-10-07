export = /* GraphQL */ `
type Query {
    students: [Student],
    studentById(id: Int!): Student
    studentBooking: [Student]
    studentByName(name: String): [Student]
}

type Mutation {
    createStudent (student: StudentInput!): Student
    createProfile (id: Int!, profile: ProfileInput!): Student
    createStudentBooking (id: Int!, booking: BookingInput!): Student
    updateStudentBooking (id: Int!, status: String!): Booking
    updateStudent(id:Int!, data: StudentInput): Student
}

input StudentInput {
    first_name: String!
    last_name: String!
    birthday: String!
    sex: String!
    school_name: String!
    school_class: String!
    sunday_class: String!
    status: String!
    parentId: Int
}

type Student {
    id: ID
    first_name: String
    last_name: String
    birthday: String
    sex: String
    profile: Profile
    parent: Parent
    relations: [Relationship]
    booking: Booking
}



input BookingInput {
    from: String
    to:  String
    status: String
}

type Booking {
    from: String
    to: String
    status: String
}
`

