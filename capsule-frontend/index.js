BASE_URL = 'http://localhost:3000'
USERS_URL = `${BASE_URL}/users`
CAPSULES_URL = `${BASE_URL}/capsules`
ARTICLES_URL = `${BASE_URL}/articles`
SUBTITLE = 'a tool for visualizing and building your capsule wardrobe'

document.addEventListener("DOMContentLoaded", function () {
  // show login modal on page load 
  // let loginForm = document.getElementById('login')
  let modal = document.getElementById('login-modal')
  modal.style.display = 'block'
  let modalContent = modal.querySelector('div.modal-content')
  createLoginModalContents(modalContent)
});

// creates the login modal
function createLoginModalContents(modalContent) {

  let div1 = document.createElement('div')
  modalContent.appendChild(div1)
  let title = document.createElement('h1')
  div1.appendChild(title)
  title.innerText = 'capsule'
  let subtitleDiv = document.createElement('div')
  subtitleDiv.className = 'subtitle'
  subtitleDiv.innerText = SUBTITLE
  div1.appendChild(subtitleDiv)
  let div2 = document.createElement('div')
  modalContent.appendChild(div2)
  let p = document.createElement('p')
  p.id = 'form-description'
  p.innerText = 'Welcome! Enter your username below to view your capsules.'
  div2.appendChild(p)

  let form = document.createElement('form')
  form.id = 'login'
  div2.appendChild(form)

  let usernameInput = document.createElement('input')
  usernameInput.type = 'text'
  usernameInput.name = 'username'
  usernameInput.placeholder = 'Username'
  form.appendChild(usernameInput)

  let submitBtn = document.createElement('input')
  submitBtn.type = 'submit'
  submitBtn.className = 'form-submit-button'
  form.appendChild(submitBtn)

  // adding event listener to the submit button on login form
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    let username = form['username'].value
    form['username'].value = ""
    checkUser(username)
    document.getElementById('login-modal').style.display = 'none'
  })
}

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
  modal.style.display = 'block'
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }
  let modalContents = modal.querySelector('div.modal-content')
  modalContents.innerHTML = ""
  renderUpdateUserForm(modalContents, user)
}

let renderUpdateUserForm = (modalContents, user) => {

  let div = document.createElement('div')
  let h1 = document.createElement('h1')
  h1.innerText = 'update your profile'
  div.appendChild(h1)
  modalContents.appendChild(div)

  div = document.createElement('div')
  div.className = 'form'
  modalContents.appendChild(div)
  let span = document.createElement('span')
  span.className = 'close'
  span.innerHTML = '&times;'
  div.appendChild(span)
  span.onclick = function () {
    modalContents.parentNode.style.display = 'none'
  }

  let form = document.createElement('form')
  form.id = 'update-user'
  div.appendChild(form)

  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'username'
  input.placeholder = 'Username'
  let label = document.createElement('label')
  label.setAttribute('for', 'username')
  label.innerText = 'Username: '
  form.appendChild(label)
  form.appendChild(input)

  input = document.createElement('input')
  input.type = 'text'
  input.name = 'location'
  input.placeholder = 'Location'
  label = document.createElement('label')
  label.setAttribute('for', 'location')
  label.innerText = 'Location: '
  form.appendChild(label)
  form.appendChild(input)

  input = document.createElement('input')
  input.type = 'submit'
  input.className = 'form-submit-button'
  form.appendChild(input)

  form['username'].value = user.username
  form['location'].value = user.location
  form.addEventListener('submit', function (e) {
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
      document.getElementById('bottom-container').style.display = 'block'
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
    showNewCapsuleForm(user)
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
    modal.style.display = 'block'
    let modalContents = modal.querySelector('div.modal-content')

    window.onclick = function (e) {
      if (e.target == modal) {
        modal.style.display = 'none'
      }
    }
    modalContents.innerHTML = ""
    renderEditCapsuleForm(modalContents, capsule)
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
        document.getElementById('bottom-container').style.display = 'none'
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
      modal.style.display = 'block'
      window.onclick = function (e) {
        if (e.target == modal) {
          modal.style.display = 'none'
        }
      }
      let modalContents = modal.querySelector('div.modal-content')
      modalContents.innerHTML = ""
      renderArticleForm(modalContents, capsule)

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

  let subTitle = document.createElement('div')
  subTitle.className = 'subtitle'
  document.getElementById('add-article-div').appendChild(subTitle)
  subTitle.innerHTML = `Season: ${capsule.season} // Style: ${capsule.style}`

  document.getElementById('add-article-div').appendChild(addBtn)
  sortArticles(capsule)
  fetchAllArticles(capsule)
}

// render edit capsule form here
let renderEditCapsuleForm = (modalContents, capsule) => {

  let div = document.createElement('div')
  let h1 = document.createElement('h1')
  h1.innerText = `edit ${capsule.name} capsule`
  div.appendChild(h1)
  modalContents.appendChild(div)

  div = document.createElement('div')
  div.className = 'form'
  modalContents.appendChild(div)
  let span = document.createElement('span')
  span.className = 'close'
  span.innerHTML = '&times;'
  div.appendChild(span)
  span.onclick = function () {
    modalContents.parentNode.style.display = 'none'
  }

  let form = document.createElement('form')
  form.id = 'edit-capsule'
  div.appendChild(form)

  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'capsulename'
  input.placeholder = 'Capsule Title'
  input.value = capsule.name
  let p = document.createElement('p')
  p.innerText = 'Capsule Title: '
  form.appendChild(p)
  form.appendChild(input)

  input = document.createElement('input')
  input.type = 'text'
  input.name = 'style'
  input.placeholder = 'Style Description'
  input.value = capsule.style
  p = document.createElement('p')
  p.innerText = 'Style Description: '
  form.appendChild(p)
  form.appendChild(input)

  let seasons = ['Winter', 'Spring', 'Summer', 'Fall', 'Rainy', 'Dry']
  let btn
  label = document.createElement('p')
  label.innerText = 'Select a Season'
  form.appendChild(label)

  seasons.forEach(season => {
    btn = document.createElement('input')
    btn.name = 'selSeason'
    btn.type = 'radio'
    btn.id = season
    btn.value = season
    label = document.createElement('label')
    label.setAttribute('for', season)
    label.innerText = season
    form.appendChild(btn)
    form.appendChild(label)
    form.appendChild(document.createElement('br'))
  })

  input = document.createElement('input')
  input.type = 'submit'
  input.className = 'form-submit-button'
  form.appendChild(input)

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    editCapsule(form, capsule)
  })
}

// rendering the article form
function renderArticleForm(modalContents, capsule) {
  let div1 = document.createElement('div')
  modalContents.appendChild(div1)
  let h1 = document.createElement('h1')
  h1.innerText = 'add your own article'
  div1.appendChild(h1)

  let div2 = document.createElement('div')
  modalContents.appendChild(div2)
  div2.className = 'form'
  let span = document.createElement('span')
  span.className = 'close'
  span.innerHTML = '&times;'
  div2.appendChild(span)

  span.onclick = function () {
    modalContents.parentNode.style.display = 'none'
  }

  let form = document.createElement('form')
  form.id = 'add-article'
  div2.appendChild(form)

  let desc = document.createElement('input')
  desc.type = 'text'
  desc.name = 'articlename'
  desc.placeholder = 'Description'
  form.appendChild(desc)

  let imgURL = document.createElement('input')
  imgURL.type = 'text'
  imgURL.name = 'image'
  imgURL.placeholder = 'Image URL Here'
  form.appendChild(imgURL)

  let categories = ['Top', 'Sweater', 'Skirt', 'Dress', 'Jeans', 'Pants', 'Accessory', 'Other']
  let btn
  let btnlabel

  let label = document.createElement('p')
  label.innerText = 'Select a Category'
  form.appendChild(label)

  categories.forEach(category => {
    btn = document.createElement('input')
    btn.name = 'selCategory'
    btn.type = 'radio'
    btn.id = category
    btn.value = category
    btnlabel = document.createElement('label')
    btnlabel.setAttribute('for', category)
    btnlabel.innerText = category
    form.appendChild(btn)
    form.appendChild(btnlabel)
    form.appendChild(document.createElement('br'))
  })

  let submitBtn = document.createElement('input')
  submitBtn.type = 'submit'
  submitBtn.className = 'form-submit-button'
  form.appendChild(submitBtn)

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    createArticle(form, capsule)
  })
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
      articleCount++
      img.setAttribute('src', article.image)
      img.addEventListener('click', function (e) { showArticle(article, capsule) })

      switch (article.category.toLowerCase()) {
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
        case "accessory":
          div = document.getElementById('accessories')
          div.appendChild(img)
          break;
        case "outerwear":
          div = document.getElementById('outerwear')
          div.appendChild(img)
          break;
        default:
          div = document.getElementById('other')
          div.appendChild(img)
      }
    })
    return articleCount
  })
}

//////!-------CREATING A NEW ARTICLE -------///////
let createArticle = (articleForm, capsule) => {
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
  }).then(resp => resp.json()).then(articles => {
    document.getElementById('add-article-modal').style.display = 'none'
    articleForm['articlename'].value = ''
    articleForm['selCategory'].value = ''
    articleForm['image'].value = ''
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

// ! ------ show add article from collection modal
let showAddArticle = (article, capsule) => {
  let modal = document.getElementById('show-add-article-modal')
  modal.style.display = 'block'
  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }
  let contentDiv = document.getElementById('add-article-details')
  contentDiv.innerHTML = ""

  let detailsDiv = document.getElementById('add-title-details')
  detailsDiv.innerHTML = ""
  let title = document.createElement('h1')
  title.innerText = article.name
  detailsDiv.appendChild(title)

  let img = document.createElement('img')
  img.setAttribute('src', article.image)
  contentDiv.appendChild(img)

  let addBtn = document.createElement('button')
  addBtn.innerText = 'Add to my Capsule'
  detailsDiv.appendChild(addBtn)

  addBtn.addEventListener('click', function (e) {
    addArticle(article, capsule)
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
let showNewCapsuleForm = user => {

  let modal = document.getElementById('add-capsule-modal')
  let modalContents = modal.querySelector('div.modal-content')
  modalContents.innerHTML = ''

  modal.style.display = 'block'

  window.onclick = function (e) {
    if (e.target == modal) {
      modal.style.display = 'none'
    }
  }

  let div = document.createElement('div')
  let h1 = document.createElement('h1')
  h1.innerText = 'create a new capsule'
  div.appendChild(h1)
  modalContents.appendChild(div)

  div = document.createElement('div')
  div.className = 'form'
  modalContents.appendChild(div)
  let span = document.createElement('span')
  span.className = 'close'
  span.innerHTML = '&times;'
  div.appendChild(span)
  span.onclick = function () {
    modalContents.parentNode.style.display = 'none'
  }

  let form = document.createElement('form')
  form.id = 'add-capsule'
  div.appendChild(form)

  let input = document.createElement('input')
  input.type = 'text'
  input.name = 'capsulename'
  input.placeholder = 'Capsule Title'
  let p = document.createElement('p')
  p.innerText = 'Capsule Title: '
  form.appendChild(p)
  form.appendChild(input)

  input = document.createElement('input')
  input.type = 'text'
  input.name = 'style'
  input.placeholder = 'Style Description'
  p = document.createElement('p')
  p.innerText = 'Style Description: '
  form.appendChild(p)
  form.appendChild(input)

  let seasons = ['Winter', 'Spring', 'Summer', 'Fall', 'Rainy', 'Dry']
  let btn
  label = document.createElement('p')
  label.innerText = 'Select a Season'
  form.appendChild(label)

  seasons.forEach(season => {
    btn = document.createElement('input')
    btn.name = 'selSeason'
    btn.type = 'radio'
    btn.id = season
    btn.value = season
    label = document.createElement('label')
    label.setAttribute('for', season)
    label.innerText = season
    form.appendChild(btn)
    form.appendChild(label)
    form.appendChild(document.createElement('br'))
  })

  input = document.createElement('input')
  input.type = 'submit'
  input.className = 'form-submit-button'
  form.appendChild(input)

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    createCapsule(form, user)
  })
}

// create new capsule from form
let createCapsule = (capsuleForm, user) => {
  fetch(CAPSULES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: capsuleForm['capsulename'].value,
      season: capsuleForm['selSeason'].value,
      style: capsuleForm['style'].value,
      user_id: user.id
    })
  }).then(resp => resp.json()).then(capsule => {
    document.getElementById('add-capsule-modal').style.display = 'none'
    fetchCapsules(user)
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
      style: editCapsuleForm['style'].value,
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

//! POPULATING THE CAROUSEL WITH DIVS FOR EACH ARTICLE
function fetchAllArticles(capsule) {
  fetch(ARTICLES_URL)
    .then(resp => resp.json())
    .then(allArticles => {
      renderCarousel(allArticles, capsule)
    })
}

let renderCarousel = (allArticles, capsule) => {
  document.getElementById('bottom-container').querySelector('h3').style.display = 'block'
  let carouselDiv = document.getElementById('carousel-container')
  carouselDiv.innerHTML = ''
  allArticles.forEach(article => {
    let div = document.createElement('div')
    div.className = 'zoom'
    carouselDiv.appendChild(div)
    let img = document.createElement('img')
    img.setAttribute('src', article.image)
    div.appendChild(img)
    img.addEventListener('click', function (e) {
      showAddArticle(article, capsule)
    })
  })
}

// !-------adds existing article to a capsule
let addArticle = (article, capsule) => {
  fetch(ARTICLES_URL + `/${article.id}/add`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: article.id,
      capsule_id: capsule.id
    })
  }).then(resp => resp.json()).then(capsule => {
    viewCapsule(capsule)
    document.getElementById('show-add-article-modal').style.display = 'none'
  })
}