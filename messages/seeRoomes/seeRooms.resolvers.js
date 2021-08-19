import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

export default{
    Query:{
        seeRooms: protectedResolver(async(_,_,{loggedInuser})=>
            client.room.findMany({
                where:{
                    users:{
                        some:{id:loggedInuser.id}
                    }
                }
            })
        )
    }
}