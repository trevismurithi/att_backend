export = /* GraphQL */ `
type Query {
    parents (page:Int, take:Int): ParentLimit
    relations: [Relationship]
    parentById(id: Int!): Parent
    findParent (name: String!): [Parent]
}

type Mutation {
    createParent(parent: ParentInput): Parent
    createRelationship(relation: ParentRelation): Parent
    updateParent (id:Int, data: ParentInput): Parent
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

type ParentLimit {
    allParents: [Parent]
    count: Int
    page: Int
    take: Int
}

type Parent {
    id: ID
    first_name: String
    last_name: String
    email: String
    sex:  String
    role: String
    birthday: String
    profile: ParentProfile
    relations: [Relationship]
    students: [Student]
}

type ParentProfile {
    birthday: String
    phone: String
    location: String
}

type Relationship {
    id: Int
    status: String
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
`