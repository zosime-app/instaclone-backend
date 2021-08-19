import client from "../../client";
import {protectedResolver} from "../../users/user.utils";
import {processHashtags} from "../photos.utils";
export default {
    Mutation:{
        editPhoto:protectedResolver(async(_, {id, caption}, {loggedInUser}) => {
            const oldPhoto = await client.photo.findFirst({
                where:{id, userId:loggedInUser.id},
                include:{
                    hashtags:{
                        select:{hashtag:true,}
                    }
                }
            });
            if(!oldPhoto){
                return{
                    oldPhoto:false,
                    error:"Photo not found."
                };
            }
            const photo = await client.photo.update({
                where:{id},
                data:{
                    caption,
                    hashtags:{
                        disconnect:oldPhoto.hashtags,
                        connectOrCreate: processHashtags(caption),
                    }
                }
            });
            return{
                ok:true
            }
        }),
    }
}