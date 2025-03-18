import * as Template from '../templates.js'

export function pageVolume(data, vol) {
    	mainContent.innerHTML = ''
        Template.Comics(data)
        Template.ComicsList(data, vol)
}