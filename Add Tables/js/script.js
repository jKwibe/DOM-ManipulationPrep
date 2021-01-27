const searchInput = document.getElementById('input');
const searchBtn = document.getElementById('button');
const totalCount = document.getElementById('totalCount');
const loader = document.getElementsByClassName('loader');
const table = document.getElementsByTagName('table');

// Function to fetch data from the API
const fetchApi = async (input) => {
    const res = await fetch(`https://jsonmock.hackerrank.com/api/cities/?city=${input}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    return res.json();
}

// Reformat the data
const dataSanitization = data => {
    const cityHash = data.reduce((acc, curr) => {
        const cityObj = Object.values(curr);
        (Object.keys(acc).indexOf(cityObj[1]) >= 0) ?
            acc[cityObj[1]].push(cityObj[0]) :
            acc[cityObj[1]] = [ cityObj[0] ]
        return acc;
    }, {});

   return Object.entries(cityHash).map( data => ( data.flatMap(el => el)));
};

// Function to print the table
const printTable = data => {
    // clear the table before print
    table[0].innerHTML = '';

    data.forEach((info, index) => {
       let tr = table[0].insertRow(index);
        info.forEach( (city, index) => {
            let td = tr.insertCell(index);
            td.innerText = city;
        });
    });
};

// Function to show the loader.
const showLoaderAndTable = (data) => {
    loader[0].style.display = 'block';
    setTimeout(() => {
        loader[0].style.display = 'none';
        printTable(data);
    }, 300);
};

// Button Click EventListeners
searchBtn.addEventListener('click', async (e) => {
    // Validate input
    const inputRegex = /^[A-Za-z]+$/;
    if(!searchInput.value.match(inputRegex)){
        alert('Invalid Input');
        return;
    };

    // Fetch API
    const response = await fetchApi(searchInput.value);

    // Sanitize data to be displayed
    const stateData = dataSanitization(response.data);

    // Display the city Count
    totalCount.innerText = `The total number of cities is ${stateData.length}`;

    //display loader and Table Data
    showLoaderAndTable(stateData);

    // reset the input
    searchInput.value = '';
});