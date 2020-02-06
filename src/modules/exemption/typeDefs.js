const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Mutation {
		"New Student Attendance Exemption"
		ExemptAttendance(
			"New exmeption input"
			model: ExemptionInput!
		): ExemptionResponse!
	}
	extend type Query {
		"Gets a single student exempted attendance"
		GetExemptedAttendance("Student id" student: ID!): ExemptionListResponse!
	}
	"New Exemption Input template"
	input ExemptionInput {
		"Attendance Objece id"
		attendance: ID!
		"Student Object id"
		student: ID!
		"Reason for exemption"
		reason: String!
		"Lecturer object id"
		lecturer: ID!
	}

	"Exemption Response Template"
	type ExemptionResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
		"Response data"
		doc: Exemption!
	}
	"Exemption List Response Template"
	type ExemptionListResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
		"Response data"
		docs: [Exemption!]
	}

	"Exemption object"
	type Exemption {
		"Attendance exemption object"
		id: ID!
		"Exempted student"
		student: Student!
		"Attendance object"
		attendance: Attendance!
		"Date created "
		created_at: String!
		"Attendance reason"
		reason: String!
	}
`;

exports.typeDefs = typeDefs;
