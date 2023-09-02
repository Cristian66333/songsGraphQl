import {mongoose} from 'mongoose'

const {Schema} = mongoose

const AuthorSchema = new Schema({
    id:{
        type : String,
        require : true,
        unique : true
    },
    name:{
        type : String,
        require : true
    },
    birthday:{
        type : Date,
        require : false
    },
    songs : [
        {
            type : Schema.Types.ObjectId,
            ref : 'song'
        }
    ]
})

const Author = mongoose.model('author',AuthorSchema)

export {Author}