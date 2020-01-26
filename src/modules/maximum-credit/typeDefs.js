const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of MaximumCredit within the system"
		getMaximumCredits: MaximumCreditListResponse!
	}

	extend type Mutation {
		"Creates new MaximumCredit object"
		createMaximumCredit(
			"MaximumCredit name"
			model: MaximumCreditInput!
		): MaximumCreditResponse!
		"Removes a single MaximumCredit object"
		DeleteMaximumCredit("MaximumCredit id" id: ID!): DeletedResponse!
	}

	"New Maximum credit unit template"
	input MaximumCreditInput {
		"Credit targeted level"
		level: Int!
		"Credit targeted department "
		department: ID!
		"Credit unit"
		creditUnit: Int!
	}

	"MaximumCredit list response template"
	type MaximumCreditListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [MaximumCredit!]
	}

	"Single MaximumCredit response template"
	type MaximumCreditResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: MaximumCredit!
	}

	"MaximumCredit object template"
	type MaximumCredit {
		"MaximumCredit id"
		id: ID!
		"Department object"
		department: Department!
		"MaximumCredit's level"
		level: Int!
		"Credit unit"
		credit_unit: Int!
		"Date created"
		created_at: String!
	}
`;

exports.typeDefs = typeDefs;
