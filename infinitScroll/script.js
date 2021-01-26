// https://jsonplaceholder.typicode.com/posts
// https://jsonplaceholder.typicode.com/posts?_limit=3&_page=2

const postContainer = document.getElementById('post-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');
const allPostsFetched = document.getElementById('all-posts-fetched');

let limit =10;
let page = 1;

// Fetch Data
async  function getPosts() {
    console.log(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`)
    const data = await res.json();
    return data;
}

// Show Posts in the DOM
async function showPosts() {
    const posts = await getPosts();

    posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
        <div class="number">${post.id}</div>
        <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">
            ${post.body}
            </p>
        </div>
        `;

        postContainer.appendChild(postEl);
    });
};

// show loading and fetch more posts

function showLoading() {
    console.log(page)
    loading.classList.add('show');
    setTimeout(()=> {
        loading.classList.remove('show');
        setTimeout(()=> {
            page++;
            showPosts();
        },350)
    }, 1000)
}
showPosts();

// Add window event listener

window.addEventListener('scroll', (e) => {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5){
        showLoading();
    }
});

filter.addEventListener('input', e => {
    const term = e.target.value.toLowerCase().trim();
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        const title = post.querySelector('.post-title').innerText.toLowerCase();
        // const body = post.querySelector('.post-body').innerText;
        if (title.indexOf(term) > -1){
            post.style.display = 'flex';
        }else {
            post.style.display = 'none';
        }
    })
})

