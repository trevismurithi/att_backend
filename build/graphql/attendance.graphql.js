"use strict";
module.exports = `
type Query {
  # Get all attendances
  studentAttendances(filter: AttendanceFilter, page: Int, take: Int): StudentAttendanceLimit
  studentAttendanceById(id: Int!): StudentAttendanceLimit
}

type Mutation {
  # Create a new attendance
  createStudentAttendance(attendance: AttendanceInput!): String
  # Delete an attendance
  deleteStudentAttendance(id: Int!): StudentAttendance
}

type StudentAttendanceLimit {
    page: Int
    take: Int
    count: Int
    attendance: [StudentAttendance]
}

input AttendanceFilter {
    studentId: Int
    date: String
    sunday_class: String
}

input AttendanceInput {
    studentIds: [Int]
    date: String
}

type StudentAttendance {
    Student: Student
    id: Int
    createdAt: String
}
`;
