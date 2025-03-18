import * as Functions from '../Functions.js'
import { router } from '../router.js'

export function pageCatalog(items, type, dataPublishers) {
    console.log('Example of data:', items[1]);
    // console.log('Example of dataPublishers:', dataPublishers[1]);
    // Functions.updateNavigation(type)
    
    // Параметри пагінації
    const itemsPerPage = 50
    let currentPage = 1
    let totalPages = Math.ceil(items.length / itemsPerPage)
    let filteredItems = [...items]
    let activeFilters = {}
    let currentView
    let currentSort

    // Створюємо основну структуру сторінки
    mainContent.innerHTML = `
        <div class="filters-section">
            <div class="list-controls">
                <span id="itemsCounter"></span>
                <input type="text" id="localSearchInput" placeholder="Пошук...">
                <div class="view-controls">
                    <button id="gridViewBtn"><i class="bi bi-grid"></i></button>
                    <button id="listViewBtn"><i class="bi bi-list-task"></i></button>
                </div>
                <button id="sortBtn" class="styled-btn has-list"><i class="bi bi-filter"></i></button>
                <div id="sortOptions" class="sort-options">
                    <button data-sort="name"><i class="bi bi-alphabet"></i> Назва</button>
                    <button data-sort="publications"><i class="bi bi-123"></i> Дата випуску</button>
                    <button data-sort="releases"><i class="bi bi-calendar"></i> Дата додавання</button>
                </div>
                <button id="filterBtn" class="styled-btn has-list"><i class="bi bi-funnel"></i></button>
                <div id="filterOptions"></div>
            </div>
        </div>
        <div class="items-list grid-view"></div>
        <div class="pagination-container">
            <div class="pagination-controls">
                <button id="prevPageBtn" class="page-btn" disabled><i class="bi bi-caret-left"></i></button>
                <div id="paginationNumbers"></div>
                <button id="nextPageBtn" class="page-btn"><i class="bi bi-caret-right-fill"></i></button>
                <input type="number" id="pageInput" min="1" placeholder="...">
            </div>
        </div>
    `

    // Отримуємо необхідні елементи DOM
    const listDiv = document.querySelector('.items-list')
    // const searchInput = document.getElementById('localSearchInput')
    // const gridViewBtn = document.getElementById('gridViewBtn')
    // const listViewBtn = document.getElementById('listViewBtn')
    // const filterBtn = document.getElementById('filterBtn')
    // const filterOptions = document.getElementById('filterOptions')
    // const prevPageBtn = document.getElementById('prevPage')
    // const nextPageBtn = document.getElementById('nextPage')
    // const paginationNumbers = document.getElementById('paginationNumbers')
    // const itemsCounter = document.getElementById('itemsCounter')

    // Встановлюємо обробники подій
    localSearchInput.addEventListener('input', handleSearch)
    gridViewBtn.onclick = () => changeView('grid')
    listViewBtn.onclick = () => changeView('list')
    filterBtn.onclick = () => toggleFilterOptions()
    prevPageBtn.onclick = () => goToPrevPage()
    nextPageBtn.onclick = () => goToNextPage()
    // filterBtn.addEventListener('click', toggleFilterOptions)
    // prevPageBtn.addEventListener('click', goToPrevPage)
    // nextPageBtn.addEventListener('click', goToNextPage)

    // Додаємо обробник для події зміни URL параметрів
    window.addEventListener('urlParamsChanged', applyURLParams)

    // Ініціалізація
    initializeView()
    initializeFilters(type)
    applyURLParams() // Застосовуємо параметри з URL при завантаженні
    
    // Функція для застосування параметрів з URL
    function applyURLParams() {
        const queryString = window.location.hash.split('?')[1];
        if (!queryString) {
            applyFilters();
            return;
        }
        
        const params = new URLSearchParams(queryString);
        
        // Застосовуємо фільтри з URL
        activeFilters = {};
        
        // Парсинг параметрів фільтрів
        for (const [key, value] of params.entries()) {
            if (key !== 'page' && key !== 'search') {
                activeFilters[key] = value.split(',');
            }
        }
        
        // Оновлюємо відображення активних фільтрів
        updateFilterButtons();
        
        // Встановлюємо поточну сторінку
        if (params.has('page')) {
            currentPage = parseInt(params.get('page'), 10) || 1;
        } else {
            currentPage = 1;
        }
        
        // Встановлюємо пошуковий запит, якщо він є
        const searchParam = params.get('search');
        if (searchParam) {
            searchInput.value = searchParam;
            handleSearch();
        } else {
            // Якщо пошуку немає, просто застосовуємо фільтри
            applyFilters(false, true);  // Додаємо true для keepPage
        }
    }
    
    // Функція для оновлення відображення кнопок фільтрів
    function updateFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn')
        filterButtons.forEach(button => {
            const filterType = button.dataset.filter
            const filterValue = button.dataset.value
            
            if (activeFilters[filterType]?.includes(filterValue)) {
                button.classList.add('active')
            } else {
                button.classList.remove('active')
            }
        })
    }
    
    // Обробник пошуку
    function handleSearch() {
        const query = searchInput.value.toLowerCase()
        const noResults = document.createElement('p')
        noResults.classList.add('no-results')
        
        const existingNoResults = document.querySelector('.no-results')
        if (existingNoResults) {
            existingNoResults.remove()
        }
        
        if (query.length === 0) {
            filteredItems = [...items]
            resetList(filteredItems.length)
            return
        }
        
        if (query.length < 3) {
            filteredItems = []
            noResults.innerHTML = '<i class="material-symbols-rounded">error</i><span>Введіть більше двох символів.</span>'
            listDiv.after(noResults)
            resetList(0)
            return
        }
        
        filteredItems = items.filter(item => {
            return  item.name?.toLowerCase().includes(query) || 
                    item.aliases?.toLowerCase().includes(query)
        })
        
        if (filteredItems.length === 0) {
            noResults.innerHTML = `
                <i class="material-symbols-rounded">data_alert</i>
                <span>За вашим запитом нічого не знайдено :(</span>
            `
            listDiv.after(noResults)
        }
        
        // Оновлюємо URL з пошуковим запитом
        updateURL(true)
        resetList(filteredItems.length)
    }

    // Налаштування вигляду списку (сітка або список)
    function initializeView() {
        currentView = Functions.getFromCache('currentView') || 'grid'
        updateViewButtons()
        listDiv.className = `items-list ${currentView}-view`
    }
    
    function updateViewButtons() {
        if (currentView === 'grid') {
            gridViewBtn.classList.add('active')
            listViewBtn.classList.remove('active')
        } else {
            listViewBtn.classList.add('active')
            gridViewBtn.classList.remove('active')
        }
    }
    
    function changeView(view) {
        if (view !== currentView) {
            currentView = view
            Functions.saveToCache('currentView', view)
            updateViewButtons()
            listDiv.className = `items-list ${view}-view`
            renderItems()
        }
    }

    function sortItems() {
        // if (type === 'Команди') {
            switch (currentSort) {
                case 'name':
                    filteredItems.sort((a, b) => a.name.localeCompare(b.name))
                    break
                case 'publications':
                    filteredItems.sort((a, b) => b.start_year - a.start_year)
                    break
                case 'releases':
                    filteredItems.sort((a, b) => new Date(b.date_added) - new Date(a.date_added))
                    break
            }
        // }
    // if (type === 'Команди') {
        // const sortBtn = document.getElementById('sortBtn')
        // const sortOptions = document.getElementById('sortOptions')
        
        sortBtn.onclick = () => {
            sortBtn.classList.toggle('active')
            sortOptions.classList.toggle('active')
        }

        sortOptions.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') {
                const sortType = e.target.dataset.sort
                currentSort = sortType
                sortItems()
                resetList(filteredItems.length)
                sortBtn.classList.remove('active')
                sortOptions.classList.remove('active')
            }
        }
    // }
    }

    // Фільтри
    function toggleFilterOptions() {
        filterBtn.classList.toggle('active')
        filterOptions.classList.toggle('active')
    }

    function initializeFilters(type) {
        let filterHTML = `
            <div>
                <h4>Жанр:</h4>
                <button class="filter-btn" data-filter="genre" data-value="Фентезі">Фентезі</button>
                <button class="filter-btn" data-filter="genre" data-value="Наукова фантастика">Наукова фантастика</button>
                <button class="filter-btn" data-filter="genre" data-value="Пригоди">Пригоди</button>
                <button class="filter-btn" data-filter="genre" data-value="Драма">Драма</button>
            </div>
            <div>
                <h4>Статус:</h4>
                <button class="filter-btn" data-filter="status" data-value="Завершено">Завершено</button>
                <button class="filter-btn" data-filter="status" data-value="Виходить">Виходить</button>
            </div>
        `
        
        filterOptions.innerHTML = filterHTML
        
        // Обробники для кнопок фільтрів
        const filterButtons = document.querySelectorAll('.filter-btn')
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterType = button.dataset.filter
                const filterValue = button.dataset.value
                
                if (activeFilters[filterType]?.includes(filterValue)) {
                    activeFilters[filterType] = activeFilters[filterType].filter(v => v !== filterValue)
                    button.classList.remove('active')
                } else {
                    if (!activeFilters[filterType]) {
                        activeFilters[filterType] = []
                    }
                    activeFilters[filterType].push(filterValue)
                    button.classList.add('active')
                }
                
                applyFilters(true)
            })
        })
    }

    function applyFilters(shouldUpdateUrl = false, keepPage = false) {
        filteredItems = items.filter(item => {
            let genreMatch = true;
            let statusMatch = true;

            genreMatch = !activeFilters.genre || activeFilters.genre.length === 0 || 
                        (item.genres && item.genres.some(genre => activeFilters.genre.includes(genre)));
            
            statusMatch = !activeFilters.status || activeFilters.status.length === 0 || 
                        activeFilters.status.includes(item.status);

            return genreMatch && statusMatch;
        });
        
        resetList(filteredItems.length, keepPage);
        
        if (shouldUpdateUrl) {
            updateURL();
        }
    }
    
    function updateURL(includeSearch = false) {
        const params = new URLSearchParams()
        
        // Додаємо активні фільтри
        Object.entries(activeFilters).forEach(([key, values]) => 
            values && values.length > 0 && params.append(key, values.join(','))
        )
        
        // Додаємо номер сторінки
        if (currentPage > 1) {
            params.append('page', currentPage)
        }
        
        // Додаємо пошуковий запит, якщо він є
        if (includeSearch && searchInput.value.length >= 3) {
            params.append('search', searchInput.value)
        }

        const currentRoute = window.location.hash.split('?')[0]
        const newUrl = params.toString() ? `${currentRoute}?${params.toString()}` : currentRoute
        const currentUrl = window.location.hash
        
        if (newUrl !== currentUrl) {
            history.pushState(null, '', newUrl)
        }
    }

    // Пагінація
    function updatePaginationControls() {
        totalPages = Math.ceil(filteredItems.length / itemsPerPage)
        
        // Оновлюємо статус кнопок пагінації
        prevPageBtn.disabled = currentPage <= 1
        nextPageBtn.disabled = currentPage >= totalPages
        
        // Оновлюємо номери сторінок
        paginationNumbers.innerHTML = ''
        
        // Визначаємо, які сторінки показувати в пагінації
        const maxButtons = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
        let endPage = Math.min(totalPages, startPage + maxButtons - 1)
        
        if (endPage - startPage + 1 < maxButtons && startPage > 1) {
            startPage = Math.max(1, endPage - maxButtons + 1)
        }
        
        // Додаємо першу сторінку
        if (startPage > 1) {
            addPageButton(1)
            if (startPage > 2) {
                addEllipsis()
            }
        }
        
        // Додаємо номери сторінок
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i)
        }
        
        // Додаємо останню сторінку
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                addEllipsis()
            }
            addPageButton(totalPages)
        }
        pageInput.placeholder = `1-${totalPages}`;
        pageInput.max = totalPages;
        pageInput.value = '';

        pageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const pageNum = parseInt(pageInput.value);
                if (pageNum >= 1 && pageNum <= totalPages) {
                    goToPage(pageNum);
                    pageInput.blur(); // Знімаємо фокус з інпута після переходу
                }
            }
        });
    }
    
    function addPageButton(pageNum) {
        const pageButton = document.createElement('button')
        pageButton.textContent = pageNum
        pageButton.classList.add('page-btn')
        
        if (pageNum === currentPage) {
            pageButton.classList.add('active')
        }
        
        pageButton.addEventListener('click', () => goToPage(pageNum))
        paginationNumbers.appendChild(pageButton)
    }
    
    function addEllipsis() {
        const ellipsis = document.createElement('span')
        ellipsis.textContent = '...'
        ellipsis.classList.add('ellipsis')
        paginationNumbers.appendChild(ellipsis)
    }
    
    function goToPage(pageNum) {
        if (pageNum !== currentPage && pageNum >= 1 && pageNum <= totalPages) {
            currentPage = pageNum
            renderItems()
            updateURL()
        }
    }
    
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--
            renderItems()
            updateURL()
        }
    }
    
    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++
            renderItems()
            updateURL()
        }
    }

    // Відображення елементів
    function renderItems() {
        listDiv.innerHTML = ''
        
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length)
        const itemsToRender = filteredItems.slice(startIndex, endIndex)
        
        itemsToRender.forEach((item) => {
            const card = createItemCard(item)
            listDiv.appendChild(card)
        })
        
        router.updatePageLinks()
        updatePaginationControls()
    }
    
    function createItemCard(item) {
        const card = document.createElement('div')
        card.classList.add('card', 'comic-card')

        const divider = ' • '
        const name = item.name.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_')
        const publisher = dataPublishers?.find(p => p.cv_id === item.publisher) || {}
        switch (type) {
            case 'Тома':
                switch (currentView) {
                    case 'grid':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.cover_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                                <small>${publisher?.name || ''}${item.publisher ? divider : ''}${item.start_year || ''}</small>
                            </div>
                        `
                        break
                        
                    case 'list':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.cover_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                                <small>${item.publisher || ''}${item.publisher ? divider : ''}${item.start_year || ''}</small>
                                <p>${item.description ? item.description.slice(0, 150) + '...' : ''}</p>
                                <div class="comic-details">
                                    <span>${publisher?.name || ''}</span>
                                    <span>${item.status || ''}</span>
                                    <span>${item.issues ? 'Випусків: ' + item.issues.length : ''}</span>
                                </div>
                            </div>
                        `
                        break
                }
                card.onclick = () => router.navigate(`/volume/${item.cv_id}-${name}`)
                break
            case 'Персонажи':
                switch (currentView) {
                    case 'grid':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.image_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                                <small>${publisher?.name || ''}</small>
                            </div>
                        `
                        break
                        
                    case 'list':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.cover_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                                <small>${item.publisher || ''}${item.publisher ? divider : ''}${item.start_year || ''}</small>
                                <p>${item.description ? item.description.slice(0, 150) + '...' : ''}</p>
                                <div class="comic-details">
                                    <span>${item.publisher || ''}</span>
                                    <span>${item.status || ''}</span>
                                    <span>${item.issues ? 'Випусків: ' + item.issues.length : ''}</span>
                                </div>
                            </div>
                        `
                        break
                }
                card.onclick = () => router.navigate(`/character/${item.cv_id}-${name}`)
                break
            case 'Творці':
                switch (currentView) {
                    case 'grid':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.image_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                            </div>
                        `
                        break
                        
                    case 'list':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.cover_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                                <small>${item.publisher || ''}${item.publisher ? divider : ''}${item.start_year || ''}</small>
                                <p>${item.description ? item.description.slice(0, 150) + '...' : ''}</p>
                                <div class="comic-details">
                                    <span>${item.status || ''}</span>
                                    <span>${item.issues ? 'Випусків: ' + item.issues.length : ''}</span>
                                </div>
                            </div>
                        `
                        break
                }
                card.onclick = () => router.navigate(`/creators/${item.cv_id}-${name}`)
                break
            case 'Видавництва':
                switch (currentView) {
                    case 'grid':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.image_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                            </div>
                        `
                        break
                        
                    case 'list':
                        card.innerHTML = `
                            <div class='poster-box'>
                                <img src='${item.cover_small}' title='${item.name}'>
                            </div>
                            <div class='info'>
                                <h3 class='truncate' title='${item.name}'>${item.name}</h3>
                                <small>${item.publisher || ''}${item.publisher ? divider : ''}${item.start_year || ''}</small>
                                <p>${item.description ? item.description.slice(0, 150) + '...' : ''}</p>
                                <div class="comic-details">
                                    <span>${item.status || ''}</span>
                                    <span>${item.issues ? 'Випусків: ' + item.issues.length : ''}</span>
                                </div>
                            </div>
                        `
                        break
                }
                card.onclick = () => router.navigate(`/publishers/${item.cv_id}-${name}`)
                break
        }
        
        return card
    }
    
    function resetList(count, keepPage = false) {
        if (!keepPage) {
            currentPage = 1;
        }
        itemsCounter.textContent = `Результатів: ${count}`;
        totalPages = Math.ceil(count / itemsPerPage);
        renderItems();
    }
    
    // Ініціалізація відображення
    renderItems()
}


function getPublisherData(data, id) {
const creatorIds = new Set()
creators.forEach(field => creatorIds.add(parseInt(field.split('-')[0])));
data.storys?.forEach(story => {
  story.creators.forEach(field => creatorIds.add(parseInt(field.split('-')[0])));
  // creatorFields.forEach(field => story[field] && creatorIds.add(parseInt(story[field].split('-')[0])));
})

// Фільтруємо потрібних авторів
// return dataPeople.filter(creator => creatorIds.has(creator.id) || null)
  // .reduce((acc, creator) => {
  //   acc[creator.id] = { name: creator.ua_name || creator.name, image: creator.image || null };
  //   return acc;
  // }, {});
}