import {createWriteStream} from 'fs';
import bcrypt from 'bcrypt';
import client from '../../client'; 
import { protectedResolver } from '../user.utils';
import { uploadToS3 } from '../../shared/shared.utils';

const resolverFn = async(
    _, //root
    {firstName, lastName, username, email, password:newPassword, bio, avatar}, //args
    {loggedInUser} //context
) => {
    let avatarUrl = null;
    if(avatar){
        avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars")
        // const {filename, createReadStream} = await avatar;
        // const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        // const readStream = createReadStream();
        // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
        // readStream.pipe(writeStream);
        // avatarUrl = `http://localhost:4000/static/${newFilename}`;
    }

    let hashPassword = null;
    if(newPassword){
        hashPassword = await bcrypt.hash(newPassword, 10);
    }
    const updateUser =  await client.user.update({
        where:{
            id: loggedInUser.id,
        },
        data:{
            firstName, 
            lastName, 
            username, 
            email,
            bio,
            ...(hashPassword && {password:hashPassword}),
            ...(avatarUrl && {avatar:avatarUrl}),
        },
    });

    if(updateUser.id){
        return {
            ok:true,
        }
    }else{
        return {
            ok:false,
            error: "Could not update profile.",
        }
    } 
};

export default {
    Mutation:{
        editProfile: protectedResolver(resolverFn),
    },
};