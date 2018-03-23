import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://dev.voamobileendpoints.com/server/graphql',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    },
  },
})

export default client
