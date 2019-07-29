BASE_URL = 'http://localhost:3000'
USERS_URL = `${BASE_URL}/users`
CAPSULES_URL = `${BASE_URL}/capsules`

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
  }).then(resp => resp.json()).then(() => {
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
      console.log(capsules)
      showCapsules(capsules)
    })
}

// show user's capsules
let showCapsules = capsules => {
  console.log(capsules)
  let userDiv = document.getElementById('show-user')
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

let viewCapsule = capsule => {
  let viewCapsuleDiv = document.getElementById('show-capsule')
  viewCapsuleDiv.innerHTML = ""
  let capH3 = document.createElement('h3')
  capH3.innerText = capsule.name
  viewCapsuleDiv.appendChild(capH3)

}
