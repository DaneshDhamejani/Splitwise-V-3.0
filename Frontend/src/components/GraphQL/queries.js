import { Query } from 'react-apollo'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost';

const LOGIN = gql`
query login($email: String, $password:String){
    login(email: $email, password: $password){
      token
    }
}`

export {LOGIN}