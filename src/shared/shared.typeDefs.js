import { gql } from "apollo-server-express";

export default gql`
    type MutationReponse{
        ok:Boolean!
        id:Int
        error:String
    }
`;