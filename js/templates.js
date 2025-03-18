import * as Utils from './Utils.js'
import { router } from './router.js'

export function ComicsList(data, vol) {
    console.log(vol)
    const issuesList = document.createElement('div')
    issuesList.className = 'issues-list'
    
    // Обробляємо кожен випуск
    for (const issue of data.issues) {
        const div = document.createElement('div')
        div.className = 'issue-box'
        // const articlePath = `articles/comics/${comics_name}/${pagename} ${issue.id}.md`
        // const exists = isArticleExists(articlePath)
        // const iDataExists = isArticleExists(articlePath)
        // if (!exists) {
        //     div.classList.add('non-existent')
        // }

        div.innerHTML = `
            <div class='issue-cover'>
                <img src="${issue.cover_small}">
                <span>#${issue.id}</span>
                <span class='issue-dates'>${Utils.formatMonthYear(issue.publication).replace(/^./, match => match.toUpperCase()) || ''}</span>
            </div>
            <span class='issue-title'>«${issue.story_title?.split('; ')[0] || 'Невідомо'}»</span>
        `
        div.onclick = () => router.navigate(`/volume/${vol}/${issue.id}`)
        issuesList.appendChild(div)
    }
    mainContent.append(issuesList)
    router.updatePageLinks()
}

export function Comics(data) {
    const boxVolume = document.createElement('div')
    boxVolume.className = 'comics-infobox infobox'

    boxVolume.innerHTML = `
        <section class='pi-image pi-item'>
            <img src="https://images.wikia.nocookie.net/marveldatabase/images/thumb/0/09/Amazing_Spider-Man_%281963%29a.png/270px-.">
        </section>
        <section class="pi-group">
            <section>
                <div class="pi-data">
                    <h3 class="pi-data-label">Видавництво:</h3>
                    <div class="pi-data-value"><a class="new" title="Marvel Comics (такої сторінки не існує)" data-uncrawlable-url="L3VrL3dpa2kvTWFydmVsX0NvbWljcz9hY3Rpb249ZWRpdCZyZWRsaW5rPTE=">Marvel Comics</a></div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Українською:</h3>
                    <div class="pi-data-value">Невідомо</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Тип:</h3>
                    <div class="pi-data-value">Тривала</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Появи:</h3>
                    <div class="pi-data-value">Невідомо</div>
                </div>
            </section>
            <section>
                <div class="pi-data">
                    <h3 class="pi-data-label">Статус:</h3>
                    <div class="pi-data-value">Завершена</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Період публікації:</h3>
                    <div class="pi-data-value">Липень '97—Лютий '09</div>
                </div>
                <div class="pi-data">
                    <h3 class="pi-data-label">Випусків:</h3>
                    <div class="pi-data-value">500 + 30 щорічників та 195 збірників</div>
                </div>
            </section>
        </section>
    `
    mainContent.prepend(boxVolume)
}