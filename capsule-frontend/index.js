BASE_URL = 'http://localhost:3000'
USERS_URL = `${BASE_URL}/users`
CAPSULES_URL = `${BASE_URL}/capsules`
ARTICLES_URL = `${BASE_URL}/articles`

document.addEventListener("DOMContentLoaded", function () {

  // adding event listener to the submit button on login form
  let loginForm = document.getElementById('login')
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let username = loginForm['username'].value
    checkUser(username)
  })

});

//////!------- USER CRUD -------///////

// Check if username exists, if yes, show user's page, if no, create account
let checkUser = username => {
  fetchUsers(username).then(allUsers => {
    let user = allUsers.find(user => {
      return user.username.toLowerCase() == username.toLowerCase()
    })
    if (user == undefined) {
      console.log('no such user')
      showNewUserForm(username)
    } else {
      showUser(user)
    }
  })
}

// show form to create new user account
let showNewUserForm = username => {
  let modal = document.getElementById('new-user-modal')
  let span = document.getElementsByClassName('close')[0]
  let description = document.getElementById('form-description')
  description.innerText = 'Looks like you\'re new here! Please create an account to continue.'
  modal.style.display = 'block'
  span.onclick = function () {
    modal.style.display = 'none'
  }
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }
  let newUserForm = document.getElementById('new-user')
  newUserForm['username'].value = username
  // add new user from form
  newUserForm.addEventListener('submit', function (e) {
    e.preventDefault()
    return fetch(USERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: newUserForm['username'].value,
        location: newUserForm['location'].value
      })
    }).then(resp => resp.json()).then((user) => {
      document.getElementById('new-user-modal').style.display = 'none'
      document.getElementById('login')['username'].value = ""
      showUser(user)
    })
  })
}

// get all users from db
let fetchUsers = () => {
  return fetch(USERS_URL).then(resp => resp.json())
}

// show user's page
let showUser = user => {
  let userDiv = document.getElementById('show-user')
  userDiv.innerHTML = ""
  let userh1 = document.createElement('h1')
  userh1.innerText = user.username
  userDiv.appendChild(userh1)

  let editBtn = document.createElement('button')
  editBtn.innerText = 'Edit Profile'
  userDiv.appendChild(editBtn)
  editBtn.addEventListener('click', function () {
    updateUser(user)
  })

  let deleteBtn = document.createElement('button')
  deleteBtn.innerText = 'Delete Profile'
  userDiv.appendChild(deleteBtn)
  deleteBtn.addEventListener('click', function () {
    deleteUser(user)
  })

  fetchCapsules(user)
}

// update user method
let updateUser = user => {
  document.getElementById('update-user-modal').style.display = 'block'
  let updateForm = document.getElementById('update-user')
  updateForm['username'].value = user.username
  updateForm['location'].value = user.location
  updateForm.addEventListener('submit', function (e) {
    e.preventDefault()
    patchUser(user)
  })
}

// patch user
let patchUser = user => {
  let updateForm = document.getElementById('update-user')
  fetch(USERS_URL + `/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: user.id,
      username: updateForm['username'].value,
      location: updateForm['location'].value
    })
  }).then(resp => resp.json()).then((user) => {
    document.getElementById('update-user-modal').style.display = 'none'
    showUser(user)
  })
}

// delete user method
let deleteUser = user => {
  return fetch(USERS_URL + `/${user.id}`, {
    method: 'DELETE'
  }).then(resp => resp.json()).then((allUsers) => {
    console.log(allUsers)
    document.getElementById('show-user').innerHTML = ""
  })
}




//////!------- CAPSULE CRUD -------///////

// fetch user's capsules
let fetchCapsules = user => {
  fetch(CAPSULES_URL)
    .then(resp => resp.json())
    .then(data => {
      let capsules = data.filter(capsule => {
        return capsule.user_id == user.id
      })
      showCapsules(capsules)
    })
}

// show user's capsules
let showCapsules = capsules => {
  let userDiv = document.getElementById('show-user')
  let addCapsuleBtn = document.createElement('button')
  addCapsuleBtn.innerText = 'Create a New Capsule'
  userDiv.appendChild(addCapsuleBtn)
  addCapsuleBtn.addEventListener('click', function(e){
    showNewCapsuleForm(capsules[0].user_id)
  })
  capsules.forEach(capsule => {
    let capDiv = document.createElement('div')
    let capH3 = document.createElement('h3')
    capH3.innerText = capsule.name
    capH3.addEventListener('click', function (e) {
      viewCapsule(capsule)
    })
    capDiv.appendChild(capH3)
    userDiv.appendChild(capDiv)
  })
}

// view specific capsule
let viewCapsule = capsule => {
  let viewCapsuleDiv = document.getElementById('show-capsule')
  let capH3 = document.createElement('h3')
  capH3.innerText = capsule.name
  viewCapsuleDiv.appendChild(capH3)
  let addBtn = document.createElement('button')
  addBtn.innerText = 'Add Article'
  viewCapsuleDiv.appendChild(addBtn)
  addBtn.addEventListener('click', function (e) {
    document.getElementById('add-article-modal').style.display = 'block'
  })
  let articleForm = document.getElementById('add-article')
  articleForm.addEventListener('submit', function(e){
    e.preventDefault()
    addArticle(articleForm, capsule)
  })
  sortArticles(capsule)
}

//////!-------FETCHING A CAPSULE'S ARTICLES -------///////
let fetchArticles = capsule => {
  return fetch(CAPSULES_URL + `/${capsule.id}`)
    .then(resp => resp.json())
}

let sortArticles = capsule => {
  fetchArticles(capsule).then(articles => {
    articles[1].forEach(article => {
      let img = document.createElement('img')
      let div
      img.setAttribute('src', article.image)
      switch (article.category) {
        case "top":
          div = document.getElementById('tops')
          div.appendChild(img)
          break;
        case "dress":
          div = document.getElementById('dresses')
          div.appendChild(img)
          break;
        case "skirt":
          div = document.getElementById('skirts')
          div.appendChild(img)
          break;
        case "pants":
          div = document.getElementById('pants')
          div.appendChild(img)
          break;
        case "sweater":
          div = document.getElementById('sweaters')
          div.appendChild(img)
          break;
        case "jeans":
          div = document.getElementById('jeans')
          div.appendChild(img)
          break;
        case "shoes":
          div = document.getElementById('shoes')
          div.appendChild(img)
          break;
        case "accessory":
          div = document.getElementById('accessories')
          div.appendChild(img)
          break;
        case "outerwear":
          div = document.getElementById('outerwear')
          div.appendChild(img)
          break;
      }
    })
  })
}

//////!-------ADDING A NEW ARTICLE -------///////
let addArticle = (articleForm, capsule) => {
  fetch(ARTICLES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: articleForm['articlename'].value,
      category: articleForm['selCategory'].value,
      image: articleForm['image'].value,
      capsule_id: capsule.id
    })
  }).then(resp => resp.json()).then(x => {
    document.getElementById('add-article-modal').style.display = 'none'
    sortArticles(capsule)
  })
}

//////!-------ADDING A NEW CAPSULE -------///////

// show new capsule form
let showNewCapsuleForm = user_id => {
  let capsuleForm = document.getElementById('add-capsule')
  document.getElementById('add-capsule-modal').style.display = 'block'
  capsuleForm.addEventListener('submit', function(e){
    e.preventDefault()
    createCapsule(capsuleForm, user_id)
  })
}

// create new capsule from form
let createCapsule = (capsuleForm, user_id) => {
  fetch(CAPSULES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: capsuleForm['capsulename'].value,
      season: capsuleForm['selSeason'].value,
      style: capsuleForm['selStyle'].value,
      user_id: user_id
    })
  }).then(resp => resp.json()).then(capsule => {
    document.getElementById('add-capsule-modal').style.display = 'none'
    viewCapsule(capsule)
  })
}