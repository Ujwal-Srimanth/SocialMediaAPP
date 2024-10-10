import User from "../models/User";

export const getUser = async(req,res) => {
    try{
        const {id} = req.params
        const user = User.findById(id)
        res.status(200).json(user)
    }catch(err){
        res.status(404).json({error:err.message})
    }
}

export const getUserFriends = async(req,res) => {
    try{
    const {id} = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id)=>User.findById)
    )

    const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) => {
        return {_id,firstName,lastName,occupation,location,picturePath}
    });
    res.status(200).json(formattedFriends)
    } catch(err){
        res.status(404).json({error:err.message})
    }
}

export const addRemoveFriend = async(req,res) => {
    try{
        const {id,friendId} = req.params;
        const user = await user.findById(id);
        const friend = await user.findById(id);
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id!==friendId)
            friend.friends = friend.friends.filter((id)=> id!==id)
        }else{
            user.friends.push(friendId)
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id)=>User.findById)
        )
    
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) => {
            return {_id,firstName,lastName,occupation,location,picturePath}
        });

        res.status(200).json(formattedFriends)




    }catch(err){

    }
}