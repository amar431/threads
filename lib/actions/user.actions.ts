"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model"
import { connectToDB } from "./mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }

export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
}:Params):Promise<void> {
    connectToDB()

   try{
    await User.findOneAndUpdate(
        { id: userId },
        {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
          },
          { upsert: true }
    )

    if (path === "/profile/edit") {
        revalidatePath(path);
      }

   }catch(error:any) {
    throw new Error(`failed to create/update user: ${error.message}`)

   }
}
export async function fetchUser(userId:string) {
  try{
    connectToDB()

    return await User
    .findOne({id:userId})
    // .populate({
    //   path:'communities',
    //   model: 'community'
    // })

  }catch(err:any) {
    throw new Error(`failed to fetch user: ${err.message}`)


  }
}

//TODO:ADD COMMUNITIES ALSO


// getting all user threads with given user id
export async function fetchUserPosts(userId:string){
  try{
    connectToDB()
    const threads = await User.findOne({id:userId})
    .populate({
      path: 'threads',
      model:Thread,
      populate:{
        path:'children',
        model:Thread,
        populate:{
          path:'author',
          model:User,
          select:'name image id'
        }
      }


    })
    return threads

  }catch(err:any){
    throw new Error(`failed to fetch posts ${err.message}`)

  }
}

export async function fetchUsers({
  pageNumber = 1,
  searchString = "",
  pageSize = 20,
  userId,
  sortBy = "desc"
  
}:{
  userId:string,
  pageNumber?:number,
  searchString:string,
  pageSize?:number,
  sortBy?:SortOrder

}){
  try{
    connectToDB()


    const skipAmount = (pageNumber - 1) * pageSize

    const regex = new RegExp(searchString,"i")

    const query:FilterQuery<typeof User> = {
      id:{$ne:userId} 
    }
    if(searchString.trim() !== ''){
      query.$or = [
        {username:{$regex:regex}},
        {name:{$regex:regex}}
      ]
      }

    const sortOptions = {createdAt: sortBy};
    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const  totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    const isNext = totalUsersCount > skipAmount + users.length  

      return ({users,isNext})

  }catch(err:any){
      throw new Error(`failed to fetch new users:${err.message}`)
  }
}

export async function getActivity(userId:string){
  try{
    connectToDB()
    const userThreads = await Thread.find({author:userId}) //find all threads created by user

    const childThreads = userThreads.reduce((acc,userThread)=>{
      return acc.concat(userThread.children)
    },[])

     const replies = await Thread.find({
      _id:{$in:childThreads},
      author:{$ne:userId},
     }).populate({
      path: 'author',
      model:User,
      select:'name image _id'
      })
      return replies
    
    }

  catch(err:any){
    throw new Error(`failed to fetch new activity:${err.message}`)
  }
}
