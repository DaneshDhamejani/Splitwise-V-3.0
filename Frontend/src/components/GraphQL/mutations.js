import { Query } from 'react-apollo'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost';

const SIGNUP = gql`
mutation signup($email: String, $password:String,$name:String){
    signup(email: $email, password: $password, name: $name){
      token
    }
}`

export {SIGNUP}