const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000


app.use(express.static(__dirname + "/public"))


let clients = 0

io.on('connection',  function (socket) {

   console.log('client numero ' + socket.id)  
     

      socket.on('NewClient' ,( )=>{
             
         if (clients < 2) {
            if(clients < 2 ){
               socket.broadcast.emit('creerOffer') // envoyer l'offre au client 2 

            }
         }
         else {
            socket.emit('SessionActive')

         }

         clients++;
      
      })
   
   // si je recois l'offer
   socket.on('EnvoieOffer', (data) =>{

   socket.broadcast.emit("FrontAnswer" , data)

   })

   //
   socket.on('Answer', (data)=>{

      socket.broadcast.emit("BackAnswer", data) // réponde au client de départ la réponse à lui avec broadcast (cad exclure le destinataire)

   })
      
 socket.on('disconnect', Disconnect)
   

})



function Disconnect() {
   if (clients > 0) {
       if (clients < 2)
           this.broadcast.emit("Disconnect")
       clients--
   }
}



http.listen(port, () => console.log(`Active on ${port} port`))
