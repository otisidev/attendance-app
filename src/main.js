const { connect } = require("../context/icontext.service");
const { ApolloServer } = require("apollo-server-lambda");
const { services, helpers, loaders } = require("./services/root.service");
const { verify } = require("jsonwebtoken");

const PORT = process.env.PORT || 4900;
//  ApolloServer instance
const server = new ApolloServer({
    modules: [
        require("./modules/department"),
        require("./modules/session"),
        require("./modules/maximum-credit"),
        require("./modules/user"),
        require("./modules/log"),
        require("./modules/department-course"),
        require("./modules/lecturer"),
        require("./modules/student"),
        require("./modules/attendance"),
    ],
    introspection: true,
    dataSources: () => ({
        ...services,
        helpers,
        loaders,
    }),
    context: async ({ event }) => {
        const cb = {
            userAgent: event.headers["user-agent"],
        };
        const auth = event.headers.authorization || event.headers.Authorization || "";
        if (auth) {
            const token = auth.split(" ")[1];
            // check if token is null or empty
            if (token) {
                // try to verify the token
                const user = verify(token, process.env.DB_KEY);
                if (user) cb.user = user;
            }
        }
        return cb;
    },
    cors: {
        origin: "*",
        credentials: true,
    },
});

// init database connection
connect()
    // .then(
    //     (status) =>
    //         status === true &&
    //         server
    //             .listen(PORT)
    //             .then(({ url, subscriptionsUrl }) => console.log(`Running @ >_ ${url}`) || console.log("Pub-Sub Server @ >_ " + subscriptionsUrl))
    //             .catch((e) => console.log("SERVER ERROR: ", e.message))
    // )
    .catch((err) => console.log("CONNECTION ERROR: ", err.message));

exports.handler = server.createHandler({
    cors: {
        origin: "*",
        credentials: true,
    },
});
