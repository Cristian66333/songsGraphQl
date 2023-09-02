import {mongoose} from 'mongoose'

const URL = "mongodb+srv://cristian:cristian@cluster0.j16t7eu.mongodb.net/music?retryWrites=true&w=majority"

mongoose.set('strictQuery',false)

const options = {
    useNewUrlParser:true, useUnifiedTopology:true
}

mongoose.connect(URL,options).then(()=>{
    console.log('Conectado a bd')
}).catch((e)=>{
    console.log(e)
})

export {mongoose}