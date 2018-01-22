import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// https://7kpr7ovy5d.execute-api.us-east-1.amazonaws.com/prod/graphql

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://7kpr7ovy5d.execute-api.us-east-1.amazonaws.com/prod/graphql',
  }),
  cache: new InMemoryCache(),
})

export default client
