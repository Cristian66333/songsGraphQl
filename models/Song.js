import {mongoose} from 'mongoose'

const {Schema} = mongoose

const SongSchema = new Schema({
    number : {
        type : Number,
        require : true,
    },
    title : {
        type : String,
        require : true
    },
    duration : {
        type : Number,
        require : true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'author'
    }
})
const Song = mongoose.model('song', SongSchema)
export {Song};