import { dataVolumes } from './loadData.js'
// import * as Components from './renderComponents.js'

export function initSearch() {
    modalSearch.onclick = (e) => {
        const {left, right, top, bottom} = modalSearch.getBoundingClientRect()
        !(left <= e.clientX && e.clientX <= right && top <= e.clientY && e.clientY <= bottom) && modalSearch.close()
    }

    const searchInput = document.getElementById('modalsearchInput')
    const searchResults = document.getElementById('modalsearchResults')
    const searchTypeSelect = document.getElementById('modalOptionsSearch')

    let searchTimeout

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(performSearch, 300)
    })
    
    searchTypeSelect.addEventListener('change', performSearch)

    function searchComicSeries(query) {
        return dataVolumes.filter(v => 
            v.name?.toLowerCase().includes(query) ||
            v.aliases?.toLowerCase().includes(query)
        ).slice(0, 20)
    }

    function searchIssues(query) {
        return dataIssues.filter(i => {
            const series = allComicSeries.find(series => issue.seriesId === series.id)
            return issue.title.toLowerCase().includes(query) ||
                series?.title?.toLowerCase().includes(query)
        }).slice(0, 20)
    }

    function searchPublishers(query) {
        return dataPublishers.filter(p => 
            p.name.toLowerCase().includes(query)
        ).slice(0, 20)
    }

    function searchCreators(query) {
        return dataCreators.filter(c => 
            c.name.toLowerCase().includes(query)
        ).slice(0, 20)
    }

    function displayResults(results, type) {
        searchResults.innerHTML = ''
        
        if (!results || results.length === 0) {
            modalsearchMsg.innerHTML = 'За вашим запитом нічого не знайдено :(. Все знищів Танос!'
            return
        } else {
            modalsearchMsg.innerHTML = ''
        }
        
        results.forEach(result => {
            const div = document.createElement('div')
            div.classList.add('search-result')
            
            switch(type) {
                case 'volumes': // Серія коміксів
                    div.innerHTML = `
                        <img src="${result.cover_small}">
                        <div>
                            <div><label class="truncate" title="${result.title}">${result.name}</label></div>
                            <p>${result.start_year}</p>
                        </div>
                    `
                    div.onclick = () => (volumePageView(result), modalSearch.close())
                    break
                case 'issues': // Випуски
                    const series = allComicSeries.find(series => result.seriesId === series.id)
                    div.innerHTML = `
                        <img src="${result.cover || series?.cover}">
                        <div>
                            <div><label class="truncate" title="${result.title}">${result.title}</label></div>
                            <p>${series?.title || ''} #${result.number || ''}</p>
                        </div>
                    `
                    div.onclick = () => (issuePageView(result), modalSearch.close())
                    break
                case 'publishers': // Видавництва
                    div.innerHTML = `
                        <img src="${result.logo}">
                        <div>
                            <strong>${result.name}</strong>
                            <p>Серій: ${result.series?.length || 0}</p>
                        </div>
                    `
                    div.onclick = () => (publisherPageView(result), modalSearch.close())
                    break
                case 'creators': // Творці
                    div.innerHTML = `
                        <img src="${result.photo || '/assets/default-avatar.png'}">
                        <div>
                            <strong>${result.name}</strong>
                            <p>Робіт: ${result.works?.length || 0}</p>
                        </div>
                    `
                    div.onclick = () => (creatorPageView(result), modalSearch.close())
                    break
            }
            
            searchResults.appendChild(div)
        })
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase()
        const searchType = searchTypeSelect.value

        if (query.length === 0) {
            searchResults.innerHTML = ''
            modalsearchMsg.innerHTML = 'Агов, ніхуя не знайдено! Почни щось вводити.'
            return
        } else if (query.length < 3) {
            searchResults.innerHTML = ''
            modalsearchMsg.innerHTML = 'Результатів дохуя ж! Введіть більше двох символів.'
            return
        }

        let results
        switch(searchType) {
            case 'volumes': // Серія коміксів
                results = searchComicSeries(query)
                break
            case 'issues': // Випуски
                results = searchIssues(query)
                break
            case 'publishers': // Видавництва
                results = searchPublishers(query)
                break
            case 'creators': // Творці
                results = searchCreators(query)
                break
        }

        displayResults(results, searchType)
    }
}