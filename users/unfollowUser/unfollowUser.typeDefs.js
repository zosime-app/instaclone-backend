import { gql } from "apollo-server-express";

export default gql`
    type Mutation{
        unfollowUser(userName:String!):MutationReponse
    }
`;