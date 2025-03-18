// import * as Functions from './js/functions.js'
// import { dataVolumes } from './js/loadData.js' // Змінні з даними
import { loadDBData } from 'js/loadData.js'
import { setupRoutes } from 'js/router.js'
import { initSearch } from 'js/search.js'
import 'js/main.js'

document.addEventListener('DOMContentLoaded', async () => {
    try {
        loadingОverlay.setAttribute("loading", "")
        await loadDBData()
        initSearch()
        setupRoutes()
        // Functions.addExternalLinkEvent()
        window.onscroll = () => window.scrollY > 0 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled') 
    } catch (error) {
        console.error('Не вийшло отримати дані:', error)
        mainContent.innerHTML = `<p>Виникла помилка при завантаженні: ${error.message}</p>`
    } finally {
        loadingОverlay.removeAttribute("loading", "")
    }
})
