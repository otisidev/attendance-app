const { connect } = require("../context/icontext.service");
const { ApolloServer } = require("apollo-server");
const { services, helpers } = require("./services/root.service");
const { verify } = require("jsonwebtoken");

//  ApolloServer instance
const server = new ApolloServer({
	modules: [
		require("./modules/department"),
		require("./modules/session"),
		require("./modules/maximum-credit"),
		require("./modules/user"),
		require("./modules/log"),
		require("./modules/department-course"),
		require("./modules/lecturer")
	],
	introspection: true,
	dataSources: () => ({
		...services,
		helpers
	}),
	context: async ({ req }) => {
		let _obj = { ip: req.ip, userAgent: req.headers["user-agent"] };
		const auth = req.headers.authorization;
		if (auth) {
			const token = auth.split(" ")[1];
			if (token) {
				try {
					const user = verify(token, process.env.DB_KEY);
					if (user) _obj.user = user;
				} catch (error) {
					console.log("Token Verifiction: ", error.message);
				}
			}
		}
		return _obj;
	}
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
