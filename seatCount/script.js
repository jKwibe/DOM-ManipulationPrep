const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const button = document.querySelector('.book-seats');

populateUI();

let ticketPrice = +movieSelect.value;

// set the total and number of seats to the DOM
function setCountAndTotal(seatsCount) {
    count.innerText = seatsCount.toString();
    total.innerText = (seatsCount * ticketPrice).toString()
}

function updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const selectedSeatsCount = selectedSeats.length;

    // copy selected seats into an array -> map through that array return anew array of indexes
    const seatIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
    localStorage.setItem('selectedSeats', JSON.stringify(seatIndex))

    setCountAndTotal(selectedSeatsCount)
}

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

// get data from localstorage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedMovieSeats'));

    if (selectedSeats !== null && selectedSeats.length > 0){
        seats.forEach( (seat, index) => {
            if (selectedSeats.indexOf(index) > -1){
                seat.classList.add('selected')
            }
        })
    }

    if (occupiedSeats !== null && occupiedSeats.length > 0){
        seats.forEach( (seat, index) => {
            if (occupiedSeats.indexOf(index) > -1){
                seat.classList.add('occupied')
            }
        })
    }
    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null){
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

function successBooked() {
    const bookedSuccess = document.querySelector('.booked-success');
    bookedSuccess.style.display = 'block';
    setTimeout(() => {
        bookedSuccess.style.display = 'none';
    }, 1000);
}

// store occupied seats to local storage and cleat selected seats from local storage
// In reality these should be fetched from the server
function addOccupiedSeats() {
    // add occupied class to all the selected seated
    const allSelectedSeats = document.querySelectorAll('.row .seat.selected');

    if (allSelectedSeats.length > 0){
        const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
        const occupiedSeats = [...selectedSeats];
        localStorage.setItem('occupiedMovieSeats', JSON.stringify(occupiedSeats));

        allSelectedSeats.forEach( seat => {
            seat.classList.remove('selected');
            seat.classList.add('occupied');
        });

        //  reset the selected count and the total
        setCountAndTotal(0);

        // add a success message
        successBooked();

        localStorage.removeItem('selectedSeats');
    }else{
        alert('Please select at least one seat')
    }
}

// event listeners

//Movie select event
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value)
    updateSelectedCount();
})

// seat Click Event
container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')){
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
})

// add submit button event listener
button.addEventListener('click', addOccupiedSeats)

// initial count when loaded
updateSelectedCount();
