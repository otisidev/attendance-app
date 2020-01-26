const { connect } = require("../context/icontext.service");
const { ApolloServer } = require("apollo-server");
const { services, helpers } = require("./services/root.service");

//  ApolloServer instance
const server = new ApolloServer({
	modules: [require("./modules/department"), require("./modules/session")],
	introspection: true,
	dataSources: () => ({
		...services,
		helpers
	})
});

// init database connection
connect()
	.then(
		status =>
			status === true &&
			server
				.listen(4900)
				.then(
					({ url, subscriptionsUrl }) =>
						console.log(`Runing @ >_ ${url}`) ||
						console.log("Pub-Sub Server @ >_ " + subscriptionsUrl)
				)
				.catch(e => console.log("SERVER ERROR: ", e.message))
	)
	.catch(err => console.log("CONNECTION ERROR: ", err.message));
