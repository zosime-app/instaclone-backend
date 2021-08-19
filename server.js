require('dotenv').config();
import express from 'express';
import logger from 'morgan';
import {ApolloServer} from 'apollo-server-express';
import {typeDefs, resolvers} from "./schema";
import { getUser, protectResolver } from './users/user.utils';

const PORT = process.env.PORT;
const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    context: async({req})=>{
        return {
            loggedInUser: await getUser(req.headers.token),
            protectResolver,
        }
    }
});

const app = express();
// app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({app});
app.listen({port:PORT},()=>{
    console.log(`> Server is running on http://localhost:${PORT}/`);
});