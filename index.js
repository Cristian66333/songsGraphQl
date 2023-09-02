import {Author}  from './models/Author.js'
import {Song}  from './models/Song.js'
import './drivers/connect-db.js'
import { ApolloServer } from '@apollo/server'

import {startStandaloneServer} from '@apollo/server/standalone'

const typeDefs = `
    scalar GraphQLDateTime
    type Author{
        _id:String,
        id:String,
        name:String,
        birthday:GraphQLDateTime,
        songs:[Song]
    },

    type Song{
        _id:String,
        number:Int,
        title:String,
        duration:Float,
        author:Author
    },

    type Query{
        songs:[Song],
        authors:[Author],
        findSongById(id:String!):Song,
        saveAuthor(id:String!,name:String!, birthday:GraphQLDateTime!):Author,
        saveSong(number:Int!,title:String!, duration:Float!,idAuthor:String!):Song,
        deleteAuthor(idAuthor:String!):Author,
        deleteSong(idSong:String!):Song
    }
    type Mutation{
        updateAuthor(id:String,name:String,birthday:GraphQLDateTime, idAuthor:String!):Author,
        updateSong(number:Int,title:String,duration:Float,idAuthor:String,idSong:String!):Song
    }
`
let saveAuthor =async (parent,args,contextValue,info)=>{
    try {
        const datos = {"id":args.id, "name":args.name, "birthday":args.birthday}
        const author = new Author(datos)
        const data = await author.save()
        return data
    } catch (error) {
        console.log(error)
        return null
    }
    
}

let saveSong = async(parent,args,contextValue,info)=>{
    try {
        const author = await Author.findById(args.idAuthor)
        const datos = {"number":args.number, "title":args.title, "duration":args.duration}
        const song = new Song(datos)
        song.author = args.idAuthor
        author.songs.push(song)
        await author.save()
        const data = await song.save()
        return data.populate('author')
    } catch (error) {
        console.log(error)
        return null
    }
}

let deleteAuthor = async (parent,args,contextValue,info)=>{
    try {
        const data = await Author.findByIdAndDelete(args.idAuthor)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
let deleteSong = async(parent,args,contextValue,info)=>{
    try {
        const data = await Song.findByIdAndDelete(args.idSong)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
let updateAuthor = async (parent,args,contextValue,info)=>{
    try{
        const author = await Author.findById(args.idAuthor)
        args.id!=null?author.id = args.id:0;
        args.name!=null?author.name = args.name:0;
        args.birthday!=null?author.birthday = args.birthday:0;
        const data = await author.save()
        return data
    }catch(error){
        console.log(error)
        return null
    }
}
let updateSong=async (parent,args,contextValue,info)=>{
    try{
        const song = await Song.findById(args.idSong)
        args.number!=null?song.number = args.number:0;
        args.title!=null?song.title = args.title:0;
        args.duration!=null?song.duration = args.duration:0;
        args.idAuthor!=null?song.author = args.idAuthor:0;
        if(args.idAuthor!=null){
            const author = await Author.findById(args.idAuthor)
            author.songs.push(song)
            await author.save()
        }
        
        const data = await song.save()
        return data
    }catch(error){
        console.log(error)
        return null
    }
}
const resolvers = {
    Query:{
        songs:async ()=> await Song.find({}),
        authors:async ()=> await Author.find({}).populate('songs'),
        findSongById:async(parent,args,contextValue,info)=>await Song.findById(args.id).populate('author'),
        saveAuthor:saveAuthor,
        saveSong:saveSong,
        deleteAuthor:deleteAuthor,
        deleteSong,deleteSong
    },
    Mutation:{
        updateAuthor:updateAuthor,
        updateSong:updateSong
    }
}

const server = new ApolloServer({
    typeDefs,resolvers
})

const {url} = await startStandaloneServer(server,{
    listen : {port:4000}
})

console.log(`Server ready at ${url}`)