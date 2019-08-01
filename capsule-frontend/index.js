BASE_URL = 'http://localhost:3000'
USERS_URL = `${BASE_URL}/users`
CAPSULES_URL = `${BASE_URL}/capsules`
ARTICLES_URL = `${BASE_URL}/articles`

document.addEventListener("DOMContentLoaded", function () {
  // show login modal on page load 
  let loginForm = document.getElementById('login')
  let modal = document.getElementById('login-modal')
  modal.style.display = 'block'
  // adding event listener to the submit button on login form
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let username = loginForm['username'].value
    loginForm['username'].value = ""
    checkUser(username)
    modal.style.display = 'none'
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
      showNewUserForm(username)
    } else {
      clearCapsuleDiv()
      showUser(user)
    }
  })
}

// show form to create new user account
let showNewUserForm = username => {
  let modal = document.getElementById('new-user-modal')
  modal.style.display = 'block'
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

  document.getElementById('back-to-login').addEventListener('click', function (e) {
    document.getElementById('new-user-modal').style.display = 'none'
    document.getElementById('login-modal').style.display = 'block'
  })

}

// get all users from db
let fetchUsers = () => {
  return fetch(USERS_URL).then(resp => resp.json())
}

// show user's page
let showUser = user => {
  let userH = document.getElementById('user-name')
  userH.innerText = user.username

  let buttonDiv = document.querySelector('div#button-list')
  buttonDiv.innerHTML = ""
  let editBtn = document.createElement('button')
  editBtn.innerText = 'Edit'
  buttonDiv.appendChild(editBtn)
  editBtn.addEventListener('click', function () {
    updateUser(user)
  })

  let deleteBtn = document.createElement('button')
  deleteBtn.innerText = 'Delete'
  buttonDiv.appendChild(deleteBtn)
  deleteBtn.addEventListener('click', function () {
    deleteUser(user)
  })

  fetchCapsules(user)
}

// update user method
let updateUser = user => {
  let modal = document.getElementById('update-user-modal')
  let span = modal.getElementsByClassName('close')[0]
  modal.style.display = 'block'
  span.onclick = function () {
    modal.style.display = 'none'
  }
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }
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
    document.getElementById('user-name').innerHTML = ""
    document.getElementById('login-modal').style.display = 'block'
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
      showCapsules(capsules, user)
    })
}

// show user's capsules
let showCapsules = (capsules, user) => {
  let capsuleBarDiv = document.getElementById('capsule-bar')
  capsuleBarDiv.innerHTML = ""
  capsules.forEach(capsule => {
    let capDiv = document.createElement('div')
    let capBtn = document.createElement('button')
    capBtn.className = 'capsule-button'
    capBtn.innerText = capsule.name
    capBtn.addEventListener('click', function (e) {
      viewCapsule(capsule)
    })
    capDiv.appendChild(capBtn)
    capsuleBarDiv.appendChild(capDiv)
  })

  let addCapsuleBtn = document.createElement('button')
  addCapsuleBtn.innerText = '+ New Capsule'
  capsuleBarDiv.appendChild(addCapsuleBtn)
  addCapsuleBtn.addEventListener('click', function (e) {
    showNewCapsuleForm(user.id)
  })

}

// view specific capsule
let viewCapsule = capsule => {
  clearCapsuleDiv()

  let capsuleHeader = document.getElementById('capsule-header-menu')
  let capH3 = capsuleHeader.querySelector('h3')
  capH3.innerText = capsule.name


  // 'edit capsule' button
  let editBtn = document.createElement('button')
  let btnList = document.createElement('div')
  btnList.id = 'button-list'
  capsuleHeader.appendChild(btnList)
  editBtn.innerText = 'Edit'
  btnList.appendChild(editBtn)
  editBtn.addEventListener('click', function (e) {
    let modal = document.getElementById('edit-capsule-modal')
    let span = modal.getElementsByClassName('close')[0]
    document.getElementById('capsule-name-field').value = capsule.name
    modal.style.display = 'block'
    span.onclick = function () {
      modal.style.display = 'none'
    }
    window.onclick = function (e) {
      if (e.target == modal) {
        modal.style.display = 'none'
      }
    }
  })
  let editCapsuleForm = document.getElementById('edit-capsule')
  editCapsuleForm.addEventListener('submit', function (e) {
    e.preventDefault()
    editCapsule(editCapsuleForm, capsule)
  })

  // 'delete capsule' button
  let deleteBtn = document.createElement('button')
  deleteBtn.innerText = 'Delete'
  btnList.appendChild(deleteBtn)
  deleteBtn.addEventListener('click', function (e) {
    fetch(CAPSULES_URL + `/${capsule.id}`, {
      method: 'DELETE'
    }).then(res => res.json()).then(x => {
      fetch(USERS_URL + `/${capsule.user_id}`).then(res => res.json()).then(user => {
        clearCapsuleDiv()
        showUser(user)
      })
    })
  })

  // 'add article to capsule' button
  let addBtn = document.createElement('button')
  addBtn.innerText = 'Add Article'
  addBtn.className = 'highlight-button'
  addBtn.addEventListener('click', function (e) {
    if (articleCount < 33) {
      let modal = document.getElementById('add-article-modal')
      let span = modal.getElementsByClassName('close')[0]
      modal.style.display = 'block'
      span.onclick = function () {
        modal.style.display = 'none'
      }
      window.onclick = function (e) {
        if (e.target == modal) {
          modal.style.display = 'none'
        }
      }
      let articleForm = document.getElementById('add-article')
      articleForm.addEventListener('submit', function (e) {
        e.preventDefault()
        addArticle(articleForm, capsule)
      })
    } else {
      let modal = document.getElementById('capsule-full-modal')
      let span = modal.getElementsByClassName('close')[0]
      modal.style.display = 'block'
      span.onclick = function () {
        modal.style.display = 'none'
      }
      window.onclick = function (e) {
        if (e.target == modal) {
          modal.style.display = 'none'
        }
      }
    }
  })

  let articleForm = document.getElementById('add-article')
  articleForm.addEventListener('submit', function (e) {
    e.preventDefault()
    addArticle(articleForm, capsule)
  })

  // 'random outfit' button
  let randomBtn = document.createElement('button')
  randomBtn.innerText = 'Outfit of the Day'
  btnList.appendChild(randomBtn)
  randomBtn.addEventListener('click', function (e) {
    getRandomOutfit(capsule)
  })

  let subTitle = document.createElement('div')
  subTitle.className = 'subtitle'
  document.getElementById('add-article-div').appendChild(subTitle)
  subTitle.innerHTML = `Season: ${capsule.season} // Style: ${capsule.style}`

  document.getElementById('add-article-div').appendChild(addBtn)
  sortArticles(capsule)
}

//////!-------FETCHING A CAPSULE'S ARTICLES -------///////
let fetchArticles = capsule => {
  return fetch(CAPSULES_URL + `/${capsule.id}`)
    .then(resp => resp.json())
}

let sortArticles = capsule => {
  fetchArticles(capsule).then(articles => {
    articleCount = 0
    articles[1].forEach(article => {
      let img = document.createElement('img')
      let div
      articleCount ++
      img.setAttribute('src', article.image)
      img.addEventListener('click', function (e) { showArticle(article, capsule) })

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
        // case "shoes":
        //   div = document.getElementById('shoes')
        //   div.appendChild(img)
        //   break;
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
    return articleCount
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
    viewCapsule(capsule)
  })
}

//////!-------SHOWING ARTICLE DETAILS -------///////
let showArticle = (article, capsule) => {
  let modal = document.getElementById('show-article-modal')
  modal.style.display = 'block'
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }

  let contentDiv = document.getElementById('article-details')
  contentDiv.innerHTML = ""

  let detailsDiv = document.getElementById('title-details')
  detailsDiv.innerHTML = ""
  let title = document.createElement('h1')
  title.innerText = article.name
  detailsDiv.appendChild(title)

  let img = document.createElement('img')
  img.setAttribute('src', article.image)
  contentDiv.appendChild(img)


  let removeBtn = document.createElement('button')
  removeBtn.innerText = 'Remove from Capsule'
  detailsDiv.appendChild(removeBtn)

  removeBtn.addEventListener('click', function (e) {
    removeArticle(article, capsule)

  })
}

//////!-------REMOVE AN ARTICLE FROM A CAPSULE -------///////
let removeArticle = (article, capsule) => {
  fetch(ARTICLES_URL + `/${article.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: article.id,
      capsule_id: capsule.id
    })
  })
    .then(res => res.json())
    .then(data => {
      viewCapsule(capsule)
      document.getElementById('show-article-modal').style.display = 'none'
    })
}

//////!-------ADDING A NEW CAPSULE -------///////

// show new capsule form
let showNewCapsuleForm = user_id => {
  let capsuleForm = document.getElementById('add-capsule')
  let modal = document.getElementById('add-capsule-modal')
  let span = modal.getElementsByClassName('close')[0]
  modal.style.display = 'block'
  span.onclick = function () {
    modal.style.display = 'none'
  }
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }
  capsuleForm.addEventListener('submit', function (e) {
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

// edit capsule from form
let editCapsule = (editCapsuleForm, capsule) => {
  return fetch(CAPSULES_URL + `/${capsule.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: capsule.id,
      name: editCapsuleForm['capsulename'].value,
      season: editCapsuleForm['selSeason'].value,
      style: editCapsuleForm['selStyle'].value,
      user_id: capsule.user_id
    })
  }).then(resp => resp.json()).then(capsule => {
    document.getElementById('edit-capsule-modal').style.display = 'none'
    viewCapsule(capsule)
    fetchCapsules({ id: capsule.user_id })
  })
}


// function to clear the capsule div every time a new capsule is selected, created, or a new user logs in
function clearCapsuleDiv() {
  let articleImgDiv = document.getElementById('show-article-imgs')
  let innerDivs = articleImgDiv.childNodes

  innerDivs.forEach(node => {
    if (node.tagName == 'SPAN') {
      node.innerText = ""
    }
  })


  document.getElementById('capsule-header-menu').innerHTML = '<h3>Select a capsule from the bar above to view it. Or, make a new capsule!</h3>'

  document.getElementById('add-article-div').innerHTML = ""
}

// create random outfit
let getRandomOutfit = function(capsule) {
  fetchArticles(capsule).then(contents => {
    dressCheck(contents)
  })    
}

// check if capsule has a dress
let dressCheck = function(contents)  {
  let capsuleItems = contents[1]
  let dressArray = []
  capsuleItems.forEach(item => {
    if (item.category === 'dress') {
      dressArray.push(item)
    }
  });
  if (dressArray.length === 0) {
    noDressOutfit(capsuleItems)
  } else {
    let whichOutfit = getRandomInt(2)
    if (whichOutfit === 0) {
      dressOutfit(capsuleItems)
    } else {
      noDressOutfit(capsuleItems)
    }
  }
}

// generate random NON-dress-based outfit
let noDressOutfit = function(capsuleItems) {
  let bottoms = []
  let tops = []
  let sweaters = []
  let accessories = []
  let outerwear = []
  
  capsuleItems.forEach(item => {
    if (item.category === 'pants' || item.category === 'skirt' || item.category === 'jeans') {
      bottoms.push(item)
    } else if (item.category === 'top') {
      tops.push(item)
    } else if (item.category === 'sweater') {
      sweaters.push(item)
    } else if (item.category === 'accessory') {
      accessories.push(item)
    } else if (item.category === 'outerwear') {
      outerwear.push(item)
    }
  })

  let bottomChoice  = randomarticle(bottoms)
  let topChoice = randomarticle(tops)
  let sweaterChoice = randomarticle(sweaters)
  let accessoryChoice = randomarticle(accessories)
  let outerwearChoice = randomarticle(outerwear)
  
  let myOutfit = [bottomChoice, topChoice, sweaterChoice, accessoryChoice, outerwearChoice]
  showOutfit(myOutfit)
}

// generate random dress-based outfit
let dressOutfit = function(capsuleItems) {
  let dresses = []
  let accessories = []
  let outerwear = []

  capsuleItems.forEach(item => {
    if (item.category === 'dress') {
      dresses.push(item)
    } else if (item.category === 'accessory') {
      accessories.push(item)
    } else if (item.category === 'outerwear') {
      outerwear.push(item)
    }
  })

  let dressChoice = randomarticle(dresses)
  let accessoryChoice = randomarticle(accessories)
  let outerwearChoice = randomarticle(outerwear)

  let myOutfit = [dressChoice, accessoryChoice, outerwearChoice]
  showOutfit(myOutfit)
}

// show the random outfit
let showOutfit = function(myOutfit) {
  let modal = document.getElementById('random-outfit-modal')
  modal.style.display = 'block'
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }

  let contentDiv = document.getElementById('outfit-images-container')
  myOutfit.forEach(article => {
    let img = document.createElement('img')
    img.setAttribute('src', article.image)
    contentDiv.appendChild(img)
  });
}


//return random article from a category
function randomarticle(articles) {
  return articles[Math.floor(Math.random() * articles.length)]
}

//generate random number (0 or 1) to determine if random outfit will be dress-based or not
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

