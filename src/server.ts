import { ApolloServer } from '@apollo/server'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadFilesSync } from '@graphql-tools/load-files'
import path from 'path'
import { startStandaloneServer } from '@apollo/server/standalone'

const PORT = 3000
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
    const server: any = new ApolloServer({
        schema
    })

    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT }
    })

    console.log(`🚀  Server ready at: ${url}`);
}

main()