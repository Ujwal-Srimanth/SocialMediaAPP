import User from "../models/User.js";

export const getUser = async(req,res) => {
    try{
        const {id} = req.params
        const user = await User.findById(id)
        console.log(id)
        res.status(200).json(user)
    }catch(err){
        console.log("hi")
        res.status(404).json({error:err.message})
    }
}

export const getUserFriends = async(req,res) => {
    try{
    console.log("bue")
    const {id} = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map((id)=>User.findById(id))
    )
    console.log(friends)

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
        console.log(id," ",friendId)
        const user = await User.findById(id);
        console.log("user",user)
        const friend = await User.findById(friendId);
        console.log("friend",friend)
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id!==friendId)
            friend.friends = friend.friends.filter((id)=> id!==id)
            console.log("hi")
        }else{
            user.friends.push(friendId)
            friend.friends.push(id);
            console.log("bye")
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        )
    
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) => {
            return {_id,firstName,lastName,occupation,location,picturePath}
        });

        res.status(200).json(formattedFriends)




    }catch(err){
        res.status(404).json({ message: err.message });
    }
}