import Navigo from "https://cdn.jsdelivr.net/npm/navigo@8/+esm"
// import { dataVolumes } from './loadData.js' // Змінні з даними
import { dataCharacters, dataPeople, dataPublishers, dataVolumes } from './loadData.js' // Змінні з даними
// import { dataCharacters, dataConcepts, dataLocations, dataObjects, dataPeople, dataPublishers, dataTeams, dataVolumes } from './loadData.js' // Змінні з даними
import { loadData } from "./loadData.js"
import { pageCatalog } from "./Views/viewCatalog.js"
import { pageIssue } from "./Views/viewIssuePage.js"
import { pageVolume } from "./Views/viewVolumePage.js"

export const router = new Navigo('/', { hash: true })

// router.hooks({
//   after: (match) => {
//     // Цей код виконується після кожної навігації
//     // Включаючи кнопку "назад" і "вперед"
//     if (match && match.url === '/volumes') {
//       // Викликати функцію яка оновить фільтри і сторінку
//       window.dispatchEvent(new CustomEvent('urlParamsChanged'))
//     }
//   }
// })

// // Додати слухач для навігації через історію браузера
// window.addEventListener('popstate', () => {
//   if (window.location.hash.startsWith('#/volumes')) {
//     window.dispatchEvent(new CustomEvent('urlParamsChanged'))
//   }
// })

export async function setupRoutes() {
    (window.location.pathname === '/ComicsTopia/' || window.location.pathname === '/' || window.location.pathname === '/index.html') && window.location.hash === '' ? router.navigate('/') : null
    router
    .on('*', () => window.scrollTo(0, 0))
    .on('/:type', (match) => {
        try {
            loadingОverlay.setAttribute('loading', '')
            switch (match.data.type) {
                case 'publishers':
                    pageCatalog(dataPublishers, "Видавництва")
                    break
                case 'volumes':
                    pageCatalog(dataVolumes, "Тома")
                    break
                case 'issues':
                    pageCatalog(dataIssues, "Випуски")
                    break
                case 'characters':
                    pageCatalog(dataCharacters, "Персонажи", dataPublishers)
                    break
                case 'creators':
                    pageCatalog(dataPeople, "Творці")
                    break
                // default:
                // issueData = volumeData.issues.find(i => i.id == issue)
            }
        }
        finally {
            loadingОverlay.removeAttribute('loading', '')
        }
    })
    // .on('/volumes', async (match) => {
    //     try {
    //         loadingОverlay.setAttribute('loading', '')
    //         pageCatalog(dataVolumes, "Тома")
    //     }
    //     finally {
    //         loadingОverlay.removeAttribute('loading', '')
    //     }
    // })
    .on('/volume/:vol/', async (match) => {
        const vol = match.data.vol
        try {
            loadingОverlay.setAttribute('loading', '')
            let volumeData = await loadData('volumes', vol)

            pageVolume(volumeData, vol)
        }
        finally {
            loadingОverlay.removeAttribute('loading', '')
        }
    })
    .on('/volume/:vol/:issue', async (match) => {
        const vol = match.data.vol
        const [issue, type] = match.data.issue.split('-')
        try {
            loadingОverlay.setAttribute('loading', '')
            let volumeData = await loadData('volumes', vol)
            let issueData
            switch (type) {
                case 'annual':
                    console.log('type', type)
                    break
                case 'oneshot':
                    console.log('type', type)
                    break
                default:
                issueData = volumeData.issues.find(i => i.id == issue)
            }
            pageIssue(issueData, vol, issue)
        }
        finally {
            loadingОverlay.removeAttribute('loading', '')
        }
    })
    router.resolve()
}
