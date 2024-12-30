import User from "../models/User.js";

export const getUserBasedOnId = async (req, res) => {
    try {
      const { id } = req.params; // `id` will be the userId in this case
      console.log("Searching for userId:", id);
  
      // Use `findOne` to search by `userId` field
      const user = await User.findById(id);
      console.log("User found:", user);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: err.message });
    }
  };
  


export const getUser = async(req,res) => {
    try{
        const {id} = req.params
        console.log(id)
        const user = await User.findById(id)
        console.log(user)
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
        user.friends.map((id)=>User.findById(id))
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
        
        const user = await User.findById(id);
        
        const friend = await User.findById(friendId);
    
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