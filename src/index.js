// Your code here

let url ='http://localhost:3000/films'
let ticketurl ="http://localhost:3000/tickets"
document.addEventListener('DOMContentLoaded',()=>{

// create a function that posts the film tickets bought to the backend

    const postTicket = async(tickets)=>{
    

    try {
        const response = await fetch(ticketurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tickets)
        });

        if (!response.ok) {
            throw new Error('Failed to post ticket');
        }
    } catch (error) {
        console.error('Error posting ticket', error);
        
    }
};
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
   buyTicketButton.dataset.movieId = movie.id;
   //add event listener
        buyTicketButton.addEventListener('click', async (event)=>{
         event.preventDefault();
          const movieId = event.target.dataset.movieId
            if (remainingMovieTickets > 0) {
                const ticket={
                    film_id: movie.id,
                    number_of_tickets:1
                }
                await postTicket([ticket]);
               
                await buyTicket(movieId);
            } else {
                console.log('No available tickets');
            }
             
         })
         
}

const buyTicket = async (movieId)=>{
    try{
        const movie = await fetchMovieDetails(movieId)
        const updateTicketSold = movie.tickets_sold+1
        const response = await fetch (`${url}/${movieId}`,{
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
        }else{
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
        if(!response.ok) {
        throw Error('failed to fetch movies');
    }
        const movies = await response.json();
       
        const moviesList = document.getElementById('films')
        moviesList.innerHTML = '';

        
        //add movies in a list order
        movies.forEach(async(movie)=>{
         const buyTicketButton = document.createElement('button')
         buyTicketButton.textContent='buy Ticket';
         buyTicketButton.dataset.movieId= movie.id
       
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
        movieLi.addEventListener('click',async(event)=>{
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



    
