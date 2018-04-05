import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://prod.voamobileendpoints.com/server/graphql',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  },
})

export default client
