const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of Session within the system"
		GetSessions: SessionListResponse!
		"Gets a single Session using its' id"
		GetSession("Session id" id: ID!): SessionResponse!
		"Get active session"
		GetActiveSession: SessionResponse!
	}

	extend type Mutation {
		"Creates new Session object"
		CreateSession(
			"New session object"
			model: NewSessionInput!
		): SessionResponse!
		"Update a single Session object"
		UpdateSession(
			"Session id"
			id: ID!
			"New Session object"
			model: NewSessionInput!
		): SessionResponse!
		"Update active session"
		SetActiveSession("Session id" id: ID!): SessionResponse!
	}

	"New session template"
	input NewSessionInput {
		"Session name"
		title: String!
		"Session's semester"
		semester: String!
		"is active"
		active: Boolean
	}

	"Session list response template"
	type SessionListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [Session!]
	}
	"Single Session response template"
	type SessionResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: Session!
	}

	"Session object template"
	type Session {
		"Session id"
		id: ID!
		"Session's title"
		title: String!
		"Semester"
		semester: String!
		"Session status"
		active: Boolean!
		"Date created"
		created_at: String!
	}
`;

exports.typeDefs = typeDefs;
