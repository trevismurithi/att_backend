"use strict";
module.exports = `
type Query {
    students (page:Int!, take: Int!): StudentLimit,
    studentById(id: Int!): Student
    studentBooking (page:Int!, take: Int!): StudentLimit
    studentByName(name: String): [Student]
    studentByBooking(name: String): [Student]
}

type Mutation {
    createStudent (student: StudentInput!): Student
    createProfile (id: Int!, profile: ProfileInput!): Student
    createStudentBooking (id: Int!, booking: BookingInput!): Student
    updateStudentBooking (id: Int!, status: String!): Booking
    updateStudentBookingDates (id: Int!, from: String!, to: String!): Booking
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
    parentId: Int
}

type StudentLimit {
    allStudents: [Student]
    count: Int
    page: Int
    take: Int
}

type Student {
    id: ID
    first_name: String
    last_name: String
    birthday: String
    sex: String
    profile: Profile
    parent: Parent
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
`;
