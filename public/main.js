let Peer = require('simple-peer')
let socket = io()
const video = document.querySelector('video')

let client = {}

navigator.mediaDevices.getUserMedia(
    {video:false ,
           audio:true
    }) 
.then( stream =>{
 
    video.srcObject = stream // création de l'objet video et audio
    video.play() // affichage de la vidéo 

    socket.emit('NewClient' ) // le socket envoie une alerte d'un nouveau client 

    function InitPeer ( type){

        let peer =  new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false  })
       
        peer.on('data', data => {
         console.log('data: ' + data)
       })

       peer.on('stream' , (stream) => {        
         creatvideo(stream)  
        
             console.log( {'data' : stream})
        
       })
 
        return peer  // faire un retour de peer ( du résultat )
     }

     

socket.on('creerOffer' , () =>{

        client.gotAnswer = false

        let peer = InitPeer('init') // execution de la fonction qui englobe les fonctionalité qu on exécute sur la vidéo , steam , close 
        peer.on('signal' , function (data){ // si ya le signal s'execute auto

            if(!client.gotAnswer){ // si ya le signal 

                socket.emit('EnvoieOffer', data) // envoyer la data type offer  
                console.log(data)

            }

        })

        client.peer = peer
        
    })

  
    //tu recois la data de type offer du serveur 
    socket.on('FrontAnswer' , (data) =>{

        let peer = InitPeer('notInit')
        peer.on('signal', (data) => { // elle s'execute auto si ya le signal 
            socket.emit('Answer', data)// répondre au client avec l'event Answer 
            console.log(data)

        })
        peer.signal(data)  // je pense c'est affiché la data recu 
        client.peer = peer

    })

 // recevoir la réponse du client de départ venant du serveur 
    socket.on('BackAnswer' , (answer) =>{

        client.gotAnswer =true //  la tu as recu la 
        let peer = client.peer
        peer.signal(answer)   // afficher la data recu 
       
    })


    socket.on('SessionActive' , ()=>{
        
        document.write('session déja activée par des clients , reviens dans un instant ')

    })



    //fonction de la création de la vidéo du destinataire
    // la fonction qui créer les éléments de la vidéo en html 
    function creatvideo (stream){ // si ya un stream 
    
        let video = document.createElement('video')
        video.id= 'peervideo'
        video.srcObject = stream // la source de la video est le stream lui même
        video.setAttribute('class', 'embed-responsive-item') // sa class 
        document.querySelector('#peerDiv').appendChild(video)
        video.play()
     }

    
 
})
.catch( err => console.log(err)) // on cas d'erreur 
