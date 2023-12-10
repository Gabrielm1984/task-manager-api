const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTION_URL)
        .then(() =>{
        console.log('Connected')
        })
        .catch((error) =>{
            console.error(error)
        })
