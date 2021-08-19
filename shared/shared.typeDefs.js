import { gql } from "apollo-server-express";

export default gql`
    type MutationReponse{
        ok:Boolean!
        error:String
    }
`;