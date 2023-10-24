import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery',true)

    if(!process.env.MONGODB_URL) return console.log('Mongodb Url is Not found')

    if(isConnected) return console.log('Mongodb is connected')

    try{
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true
        console.log("connected to mongodb")

    }catch(err) {
        console.log(err)

    }

}