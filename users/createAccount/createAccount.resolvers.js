import bcrypt from 'bcrypt';
import client from '../../client'

export default{
    Mutation:{
        createAccount: async (_, {
            firstName,
            lastName,
            userName,
            email,
            password,
        }) => {
            try{
                const existingUser = await client.user.findFirst({
                    where:{
                        OR: [
                            {
                                userName,
                            },
                            {
                                email,
                            },
                        ]
                    },
                });
                if(existingUser){
                    throw new Error("This userName/password is already taken.");
                }
                const hashPassword = await bcrypt.hash(password,10)
                await client.user.create({
                    data:{
                        userName,
                        email,
                        firstName,
                        lastName,
                        password:hashPassword,
                    }
                });
                return{
                    ok:true,
                }
            }catch(e){
                return{
                    ok:false,
                    error:"Cant create account.",
                }
            }
        },
    }
};