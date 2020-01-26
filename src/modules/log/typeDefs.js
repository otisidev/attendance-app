const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of user activity log"
		getLogs(
			"page number"
			page: Int
			"Maximum record per request"
			limit: Int
			"user's object id"
			user: ID
		): LogListResponse!
	}

	"Log list response template"
	type LogListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [Log!]
	}

	"Log object template"
	type Log {
		"Log id"
		id: ID!
		"Log description"
		desc: String!
		"Log's action"
		action: String!
		"IP Address"
		ip: String!
		"User browser agent"
		user_agent: String!
		"Date created"
		created_at: String!
		"User"
		user: User!
	}
`;

exports.typeDefs = typeDefs;
