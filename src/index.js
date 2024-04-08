// Your code here
//this code is full of bugs but i tried my best  😭
let url ='http://localhost:3000/films'

document.addEventListener('DOMContentLoaded',()=>{
//this allows accses to the server containing all the movies
   const fetchMovieDetails = async (id) =>{
       // a try block allows you to define a block of code to be tested for errors while being executed

    try {
           const response = await fetch(`${url}/${id}`);
           return await response.json();
       } catch (error) {
           return console.error('ERROR fetching movie', error);
       }
   }
   //now we want to show the movie details in the webpage
   const displayMovieDetails =(movie)=>{

//these allow us to accses the various items in the html and add what we need
   const poster = document.getElementById('poster')
   poster.src = movie.poster;
   
   const title = document.getElementById('title')
   title.textContent = movie.title;

   const runtime = document.getElementById('runtime')
   runtime.textContent = `${movie.runtime}Minutes`;

   const filmInfo = document.getElementById('film-info')
   filmInfo.textContent = movie.description;

   const showtime = document.getElementById('showtime')
   showtime.textContent = movie.showtime;

   const ticketNum = document.getElementById('ticket-num')
   
   const remainingMovieTickets = movie.capacity - movie.tickets_sold;
   ticketNum.textContent = `${remainingMovieTickets} tickets`
  
  
   const buyTicketButton = document.getElementById('buy-ticket')
   //enables the button 
   if(remainingMovieTickets > 0 ){
    buyTicketButton.textContent = 'buy ticket ASAP'
    buyTicketButton.disabled = false;
}
//disables the button when tickets are 0
else{
    buyTicketButton.textContent = 'Sold out '
    buyTicketButton.disabled = true
    }

        //add functionality to the button
        //when the tickets end it logs no available tickets
        buyTicketButton.addEventListener('click', async (event)=>{
         
         
             if(remainingMovieTickets > 0){
                await buyTicket(movie)
             }
             else{
                 console.log('no available tickets');
             }
         })
}

const buyTicket = async (movie)=>{
    try{
        const updateTicketSold = movie.tickets_sold+1
        const response = await fetch (`${url}/${movie.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                tickets_sold:updateTicketSold,
            })
        });
        if(response.ok){
            const updatedMovie = await response.json();
            displayMovieDetails(updatedMovie);
        // you can add alerts for more functionality
            alert('happy watching')
        }
        else{
            console.error('failed to update tikets sold on server')
        }

    }  
    catch(error){
        console.error('error buying ticket', error)
    }
}
//making the delete request 
const deleteFilm = async (filmId) =>{
    try{
        const response =await fetch(`${url}/${filmId}`, 
        { method: 'DELETE' });
        return response.ok;
    }
    catch(error){
        console.error('error del film',error);
        return false;
    }

}
const removeFilmFromList = (filmId)=>{
    const filmElement = document.getElementById(`film-${filmId}`)
   if(filmElement)filmElement.remove();
}




const movieMenu = async () => {
    // a try block allows you to define a block of code to be tested for errors while being executed
    
    try {
        const response = await fetch(url);
        const movies = await response.json();
       
        const moviesList = document.getElementById('films')
        moviesList.innerHTML = '';

        
        //add movies in a list order
        movies.forEach(async(movie)=>{
        const movieLi = document.createElement('li')
        movieLi.classList.add('film','item');
        //dispaly movie title in the list
        movieLi.textContent = movie.title
        
        
        //make delete button
        const deleteButton = document.createElement('button')
        deleteButton.textContent='Delete'
        deleteButton.addEventListener('click',async()=>{
            if (confirm('Are you sure you want to delete this film?')){
                if (await deleteFilm(movie.id)) removeFilmFromList(movie.id);
            }
        })
      /// kindly note that you will have to reload the page manualy for the delete function to work
       movieLi.appendChild(deleteButton);
        //add click to display movie details
        movieLi.addEventListener('click',async()=>{
            displayMovieDetails(movie)
        })
         moviesList.appendChild(movieLi)
        })
    }
     catch(error){
        console.error('ERROR DISPLAYING MOVIES',error)
     }

    
}


//calling the functions to display details on my page
movieMenu();
fetchMovieDetails(1)
.then(movie => displayMovieDetails(movie))
.catch(error => console.error('error fetching and displayng movie details',error))
});



    
