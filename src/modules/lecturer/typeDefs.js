const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of Lecturer within the system"
		GetLecturers: LecturerListResponse!
		"Gets a single Lecturer using its' id"
		GetLecturer("Lecturer id" id: ID!): LecturerResponse!
	}

	extend type Mutation {
		"Creates new Lecturer object"
		CreateLecturer(
			"new lecturer model"
			model: LecturerInput!
		): LecturerResponse!
		"Update a single Lecturer object"
		UpdateLecturer(
			"Lecturer id"
			id: ID!
			"New Lecturer name"
			name: String!
			"Phone number"
			phone: String!
		): LecturerResponse!
		"Removes a single Lecturer object"
		DeleteLecturer("Lecturer id" id: ID!): DeletedResponse!
		"Update a single lecturer's fingerprint data"
		UpdateLecturerBiometric(
			"lecturer's id"
			id: ID!
			"Fingerprint template"
			fingerprint: ID!
		): LecturerResponse!
		"Upload lecturer biometric file"
		UploadLecturerBiometricData(
			"File containing a list of id and fingerprint of lecturer"
			file: Upload!
		): UploadResponse!
	}
	"Lecturer input template"
	input LecturerInput {
		"lecturer's name"
		name: String!
		"lecturer's email address"
		email: String!
		"lecturer's phone number"
		phone: String!
	}

	"Lecturer list response template"
	type LecturerListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [Lecturer!]
	}
	"Single Lecturer response template"
	type LecturerResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: Lecturer!
	}

	"Lecturer object template"
	type Lecturer {
		"Lecturer id"
		id: ID!
		"Lecturer's name"
		name: String!
		"Phone number"
		phone: String!
		"email address"
		email: String!
		"Fingerprint template (Binary)"
		fingerprint: ID
		"Date created"
		created_at: String!
		"Assigned departmental course"
		assigned_courses: [DepartmentalCourse!]
	}
`;

exports.typeDefs = typeDefs;
