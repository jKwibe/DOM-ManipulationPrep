const  draggable_list = document.getElementById('draggable-list');
const  check = document.getElementById('check');

const richestPeople = [
    'Jeff Bezos',
    'Bill Gates',
    'Warren Buffet',
    'Bernard Arnault',
    'Carlos Slim Helu',
    'Amancio Ortega',
    'Larry Ellison',
    'Mark Zuckerberg',
    'Michael Bloomberg',
    'Larry Page'
];

// store list Items
const listItems = [];

let dragStartIndex;

createList();


// Insert list items into DOM
function createList() {
    [...richestPeople]
        .map(a => ({ value: a, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((person, index)=> {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-index', index);
            listItem.innerHTML = `
            <span class='number'> ${index +1} </span>
            <div class="draggable" draggable="true">
                <p class="person-name">${person}</p>
                <i class="fas fa-grip-lines"></i>
            </div>
            `;
            listItems.push(listItem);
            draggable_list.appendChild(listItem);
        });
    addEventListeners();
};

function dragStart() {
    // console.log('Drag Started')
    dragStartIndex = +this.closest('li').getAttribute('data-index')
    console.log(dragStartIndex);
}
function dragEnter() {
    // console.log('Drag Entered')
    this.classList.add('over');
}
function dragLeave() {
    // console.log('Drag Leave')
    this.classList.remove('over');
}
function dragOver(e) {
    e.preventDefault();
    // console.log('Drag Over')
}
function dragDrop() {
    // console.log('Drag dropped')
    const dragEndIndex = this.getAttribute('data-index')
    this.classList.remove('over');
    swapItems(dragStartIndex, dragEndIndex);
}

function swapItems(fromIndex, toIndex) {
    const itemOne = listItems[fromIndex].querySelector('.draggable');
    const itemTwo = listItems[toIndex].querySelector('.draggable');
    console.log(listItems)

    listItems[fromIndex].appendChild(itemTwo);
    listItems[toIndex].appendChild(itemOne);
}

function checkOrder() {
    console.log('Checked')
    listItems.forEach((listItem, index) => {
        const personName = listItem.querySelector('.draggable').innerText.trim();
        if(personName !== richestPeople[index]){
            listItem.classList.add('wrong');
        }else{
            listItem.classList.remove('wrong');
            listItem.classList.add('right');
        }
    })
}

function addEventListeners(){
    const draggables = document.querySelectorAll('.draggable');
    const dragListItems = document.querySelectorAll('.draggable-list li');

    draggables.forEach( draggable => {
        draggable.addEventListener('dragstart', dragStart)
    });

    dragListItems.forEach( item => {
        item.addEventListener('dragover', dragOver)
        item.addEventListener('drop', dragDrop)
        item.addEventListener('dragenter', dragEnter)
        item.addEventListener('dragleave', dragLeave)
    });
};

check.addEventListener('click', checkOrder)