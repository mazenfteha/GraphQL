const express = require('express')
const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList
    } 
    = graphql
const { graphqlHTTP } = require("express-graphql")

const userData = require("./MOCK_DATA.json")

const app = express()
const PORT = 6969

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {type: GraphQLInt},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RoorQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: {id : {type: GraphQLInt}},
            resolve() {
                return userData
            }
        }
    }
})
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        creatUser : {
            type : UserType,
            args: {
                firstName : { type : GraphQLString },
                lastName : { type : GraphQLString },
                email : { type : GraphQLString },
                password : { type : GraphQLString },
            },
            resolve(args) {
                userData.push({id: userData.length + 1, firstName: args.firstName, lastName: args.lastName, email: args.email, password: args.password})
                return args
            }
        }
    }
})

const schema = new GraphQLSchema({query:RootQuery , mutation:Mutation })

//create a GraphQL server :
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})