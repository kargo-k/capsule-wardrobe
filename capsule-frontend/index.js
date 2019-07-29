BASE_URL = 'http://localhost:3000'
USERS_URL = `${BASE_URL}/users`

document.addEventListener("DOMContentLoaded", function() {
  
  // adding event listener to the submit button on login form
  let loginForm = document.getElementById('login')
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault()
    let username = loginForm['username'].value
    checkUser(username)
  })

});

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
  modal.style.display = 'block'
  span.onclick = function() {
    modal.style.display = 'none'
  }
  window.onclick = function(e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }
  let newUserForm = document.getElementById('new-user')
  // add new user from form
  newUserForm.addEventListener('submit', function(e) {
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
  console.log(user)
  let userDiv = document.getElementById('show-user')
  userDiv.innerHTML = ""
  let userh1 = document.createElement('h1')
  userh1.innerText = user.username
  userDiv.appendChild(userh1)
  showCapsules(user)
}

// fetch user's capsules
let fetchCapsules = user => {
  return fetch(USERS_URL + `/${user.id}`).then(resp => resp.json())
}

// show user's capsules
let showCapsules = user => {
  let userData = fetchCapsules(user).then(data => {
    let userDiv = document.getElementById('show-user')
    data[1].forEach(capsule => {
      let capDiv = document.createElement('div')
      let capH3 = document.createElement('h3')
      capH3.innerText = capsule.name
      capDiv.appendChild(capH3)
      userDiv.appendChild(capDiv)
    })
  })
}