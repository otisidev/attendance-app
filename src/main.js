const { connect } = require("../context/icontext.service");
const { ApolloServer } = require("apollo-server");

//  ApolloServer instance
const server = new ApolloServer({
	modules: [require("./modules/department")],
	introspection: true
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
