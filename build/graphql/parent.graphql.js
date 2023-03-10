"use strict";
module.exports = `
type Query {
    parents: [Parent]
    relations: [Relationship]
    parentById(id: Int!): Parent
}

type Mutation {
    createParent(parent: ParentInput): Parent
    createRelationship(relation: ParentRelation): Parent
}

input ParentRelation {
    id: Int!,
    status: String,
    student: StudentInput
}

input ParentInput {
    first_name: String
    last_name: String
    email: String
    birthday: String
    sex:  String
    role: String
    student: StudentInput
}

input StudentInput {
    first_name: String!
    last_name: String!
    birthday: String!
    sex: String!
}

type Parent {
    id: ID
    first_name: String
    last_name: String
    email: String
    sex:  String
    role: String
    relations: [Relationship]
    students: [Student]
}

type Relationship {
    id: Int
    status: String
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
}


type Profile {
    id: ID
    school_name: String
    school_class: String
    sunday_class: String
    image: String
}

input ProfileInput {
    school_class: String!
    school_name: String!
    sunday_class: String!
}
`;
