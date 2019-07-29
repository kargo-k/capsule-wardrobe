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

let checkUser = (username) => {

  fetchUsers(username).then(allUsers => {
    let user = allUsers.find(user => {
      return user.username == username
    })

    if (user == undefined) {
      console.log('no such user')
      // make a new user
    } else {
      showUser(user)
    }

  })

}

let fetchUsers = () => {
  return fetch(USERS_URL).then(resp => resp.json())
}

let showUser = user => {
  console.log(user)
  let userDiv = document.getElementById('show-user')
  userDiv.innerHTML = ""
  let userh1 = document.createElement('h1')
  userh1.innerText = user.username
  userDiv.appendChild(userh1)
}