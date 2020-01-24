const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of department within the system"
		getDepartments: [String!]
	}
`;

exports.typeDefs = typeDefs;
