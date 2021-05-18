import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Main from './components/Main';



import ApolloClient from 'apollo-boost'
//const { ApolloClient } = require('apollo-client')
//import ApolloClient from '@apollo/client'
import {ApolloProvider} from 'react-apollo'
//import { ApolloClient } from 'apollo-client'

const client= new ApolloClient({
  uri:'http://localhost:3001/graphql'
})





function App() {
  return (
    //Use Browser Router to route to different pages
    <ApolloProvider client={client}>

    <BrowserRouter>
    <div>
      {/* App Component Has a Child Component called Main*/}
      <Main/>
    </div>
  </BrowserRouter>
  </ApolloProvider>
  );
}

export default App;
