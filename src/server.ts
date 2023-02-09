import { ApolloServer } from '@apollo/server'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import bodyParser from 'body-parser'
import cookiePaser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import { loadFilesSync } from '@graphql-tools/load-files'
import { startStandaloneServer } from '@apollo/server/standalone'
import path from 'path'
import { verifyUser } from './services/jwt'




// define contexts interface etc


interface tokenUser {
    id: Number,
    username: String
}

// Required logic for intergrating with express
const app = express()

// express use cookie parser
app.use(cookiePaser())

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to drain this httpServer
// enabling our servers to shut down gracefully
const httpServer = http.createServer(app)

const PORT: any = process.env.PORT || 4000
// load the schemas

const typeDefsArray = loadFilesSync(path.join(__dirname, 'graphql'), {
    extensions: ['graphql']
})


const resolversArray = loadFilesSync(path.join(__dirname, 'routes'), {
    extensions: ['resolvers.js']
})


async function main () {
    const schema = makeExecutableSchema({
        typeDefs: typeDefsArray,
        resolvers: resolversArray
    })
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })
    // Ensure we wait for our server to start
    await server.start()

    // Set up our Express middleware to handle CORS, body parsing,
    // and our expressMiddleware function
    app.use(
        '/',
        cors<cors.CorsRequest>({
            origin: 'http://localhost:3000',
            credentials:  true
        }),
        // 50mb is the limit that startStandaloneServer uses, 
        // but you may configure this to suit your needs
        bodyParser.json({ limit: '50mb' }),
        // expressMiddleware accepts the same arguments:
        // an Apollo Server instance and optional configuration options
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                let token: String = ''
                if (req.headers.authorization) {
                    token = req.headers.authorization.split(' ')[1]
                }
                if (verifyUser(token) == undefined) {
                    return {
                        user: null,
                        req,
                        res
                    }
                }
                // get the user if not null
                const user: any = verifyUser(token)
                return {
                    user,
                    req,
                    res
                }
            }
        })
    )

    // Modified server startup
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
}


async function standAlone () {
    // Hardcoded data store
    const books = [
        {
            title: 'The Awakening',
            author: 'Kate Chopin',
        },
        {
            title: 'City of Glass',
            author: 'Paul Auster',
        },
    ];

    // Schema definition
    const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

    // Resolver map
    const resolvers = {
        Query: {
            books() {
                return books;
            },
        },
    };

    // Pass schema definition and resolvers to the
    // ApolloServer constructor
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    // Launch the server
    const { url } = await startStandaloneServer(server);

    console.log(`🚀 Server listening at: ${url}`);
}

standAlone()