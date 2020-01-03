(function () {
// new variable
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'

  const dataPanel = document.getElementById('data-panel')
  const switchIcon = document.querySelector('.switchIcon')
  const hashtag = document.querySelector('.hashtag')
  console.log(hashtag)
  //搜尋
  const searchForm = document.getElementById('search-form')
  const searchInput = document.getElementById('search-input')
  //分頁
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let currentPage = 1

  //透過API取得電影資料
  axios.get(INDEX_URL).then((response) => {
    model.apiData.push(...response.data.results)
    controller.getTotalPages(model.apiData) //顯示總頁數
    controller.getPageDataByCard(1, model.apiData) //顯示每頁電影資料
    controller.getAsideContent(model.genresData)
    console.log(model.apiData[2].genres[2])
    

  }).catch((err) => console.log(err))

  const view = {
    displayMovieByCard (data) {   
      let cardContent = ''
      data.forEach(function (item, index) {
        cardContent += `
        <div class="col-sm-3 cardItem">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>          
              <p class="hashtag h6"><mark><small>${controller.getGenres(item.genres)}</small></mark></div>
            </div>
          </div>
        </div> `
      })
      dataPanel.innerHTML = cardContent   
    },
    displayMovieByBar(data){
      let barContent = ''
      data.forEach(function(item, index) {
          barContent += `
            <div class="col-6 barItem">${item.title}</div>
              <div class="col-6 text-right mb-2">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>`
      })
      dataPanel.innerHTML = barContent
    },

    displayAside(items) {
      let asideContent = ''
      for(let item in items) {
          asideContent +=`
          <button type="button" data-index="${item}"class="list-group-item list-group-item-action">${items[item]}</button>`
      }
      aside.innerHTML = asideContent
    },

    //顯示電影(Modal)
    displayMovieModal(id) {
      //get elements
      const modalTitle = document.getElementById('show-movie-title')
      const modalImage = document.getElementById('show-movie-image')
      const modalDate = document.getElementById('show-movie-date')
      const modalDescription = document.getElementById('show-movie-description')

      // set request url
      const url = INDEX_URL + id
      // send request to show api
      axios.get(url).then(response => {
        const data = response.data.results
        //console.log(data)
        // insert data into modal ui
        modalTitle.textContent = data.title
        modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at : ${data.release_date}`
        modalDescription.textContent = `${data.description}`
      })
    },
  }

  const controller = {
    //增加最愛電影
    addFavoriteItem(id) {
      const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
      const movie = data.find(item => item.id === Number(id))
  
      if(list.some(item => item.id === Number(id))){
          alert(`${movie.title} is already in your favorite list.`)
      } else {
          list.push(movie)
          alert(`Added ${movie.title} to your favorite list!`)
      }
      localStorage.setItem('favoriteMovies', JSON.stringify(list))
    },
    //分頁欄
    getTotalPages(data) {
      let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
      let pageItemContent = ''
      for (let i = 0; i < totalPages; i++) {
        pageItemContent += `
          <li class="page-item">
            <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
          </li>`
      }
      pagination.innerHTML = pageItemContent
    },
    //卡片方式顯示 每個分頁電影資料
    getPageDataByCard (pageNum, data) {
      currentPage = pageNum || currentPage 
      model.paginationData = data || model.paginationData
      let offset = (pageNum - 1) * ITEM_PER_PAGE
      let pageData = model.paginationData.slice(offset, offset + ITEM_PER_PAGE)
      view.displayMovieByCard(pageData)
    },
    //清單方式顯示 每個分頁電影資料
    getPageDataByBar (pageNum, data) {
      currentPage = pageNum || currentPage
      model.paginationData = data || model.paginationData
      let offset = (pageNum - 1) * ITEM_PER_PAGE
      let pageData = model.paginationData.slice(offset, offset + ITEM_PER_PAGE)
      view.displayMovieByBar(pageData)
    },
    getAsideContent() {
      view.displayAside(model.genresData)
    },
    //產生genres物件
    getMovieGenres(index){
      let searched = model.apiData.map(obj => {
        if ( Object.values(obj.genres).indexOf(index) != -1 )
            return obj;
            console.log(this.obj)
        });
        return searched.filter(obj => obj != undefined);
    },
    getMainContent() {
      view.displayMovieByCard(model.sortMoveData)
    },
    getGenres(arr) {
      let j, k = ''
      for(let i=0; i<arr.length; i++) {
        j = arr[i] //API Data內genres資料
        k += `<mark class="mr-2"><small>${model.genresData[j]}</small></mark>`
      }
      return k
    }
  }
  
  const model = {
    apiData: [],
    paginationData : [],
    sortMoveData: {},
    searchResults: [],
    genresData: 
    {
        "1": "Action",
        "2": "Adventure",
        "3": "Animation",
        "4": "Comedy",
        "5": "Crime",
        "6": "Documentary",
        "7": "Drama",
        "8": "Family",
        "9": "Fantasy",
        "10": "History",
        "11": "Horror",
        "12": "Music",
        "13": "Mystery",
        "14": "Romance",
        "15": "Science Fiction",
        "16": "TV Movie",
        "17": "Thriller",
        "18": "War",
        "19": "Western"
      }
  }

  //=====監聽器=====
  // 顯示Motal及加入最愛電影
  dataPanel.addEventListener('click', (event) => {
    if(event.target.matches('.btn-show-movie')) {
        view.displayMovieModal(event.target.dataset.id)
        console.log('Display Movie Modal')
    } else if(event.target.matches('.btn-add-favorite')) {
        controller.addFavoriteItem(event.target.dataset.id)
        console.log('Add Favorite Item')
    } 
  })

  //切換顯示
  switchIcon.addEventListener('click', (event) => {
    if(event.target.matches('.fa-bars')){
        controller.getPageDataByBar(currentPage)
        console.log('Get Page Data by Bar')
    } else if(event.target.matches('.fa-th')){
        controller.getPageDataByCard(currentPage)
        console.log('Get Page Data by Card')
    }
  })

  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const regex = new RegExp(searchInput.value, 'i')
    model.searchResults = data.filter(movie => movie.title.match(regex))
    
    if(dataPanel.children[1].classList[1] ==='cardItem'){
      controller.getTotalPages(results)
      controller.getPageDataByCard(1, results)
    } else {
      controller.getTotalPages(results)
      controller.getPageDataByBar(1, results)
    }
  })

  //換頁
  pagination.addEventListener('click', event => {
    //console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      if(dataPanel.children[1].classList[1] ==='cardItem'){
        controller.getPageDataByCard(event.target.dataset.page)
      } else {
        controller.getPageDataByBar(event.target.dataset.page)
      }
    }
  })
  
  //選擇左側欄項目在右側欄顯示
  aside.addEventListener('click', (event) => {
    const genresIndex = Number(event.target.dataset.index)
    model.sortMoveData = controller.getMovieGenres(genresIndex)
    controller.getMainContent()
    controller.getTotalPages(model.sortMoveData)
    controller.getPageDataByCard(1, model.sortMoveData) 
    
  })
})()
