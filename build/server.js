"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const load_files_1 = require("@graphql-tools/load-files");
const merge_1 = require("@graphql-tools/merge");
const path_1 = __importDefault(require("path"));
const jwt_1 = require("./services/jwt");
// Required logic for intergrating with express
const app = (0, express_1.default)();
// express use cookie parser
app.use((0, cookie_parser_1.default)());
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to drain this httpServer
// enabling our servers to shut down gracefully
const httpServer = http_1.default.createServer(app);
const PORT = process.env.PORT || 4000;
// load the schemas
const typeDefsArray = (0, load_files_1.loadFilesSync)(path_1.default.join(__dirname, 'graphql'), {
    extensions: ['graphql']
});
const resolversArray = (0, load_files_1.loadFilesSync)(path_1.default.join(__dirname, 'routes'), {
    extensions: ['resolvers.js']
});
async function main() {
    // const schema = makeExecutableSchema({
    //     typeDefs: mergeTypeDefs(typeDefsArray),
    //     resolvers: mergeResolvers(resolversArray)
    // })
    const server = new server_1.ApolloServer({
        typeDefs: (0, merge_1.mergeTypeDefs)(typeDefsArray),
        resolvers: (0, merge_1.mergeResolvers)(resolversArray),
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
    });
    // Ensure we wait for our server to start
    await server.start();
    // Set up our Express middleware to handle CORS, body parsing,
    // and our expressMiddleware function
    app.use('/', (0, cors_1.default)({
        origin: 'http://localhost:3000',
        credentials: true
    }), 
    // 50mb is the limit that startStandaloneServer uses, 
    // but you may configure this to suit your needs
    body_parser_1.default.json({ limit: '50mb' }), 
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    (0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => {
            let token = '';
            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[1];
            }
            if ((0, jwt_1.verifyUser)(token) == undefined) {
                return {
                    user: null,
                    req,
                    res
                };
            }
            // get the user if not null
            const user = (0, jwt_1.verifyUser)(token);
            return {
                user,
                req,
                res
            };
        }
    }));
    // Modified server startup
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
}
main();
