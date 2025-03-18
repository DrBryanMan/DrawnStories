export function generateStoriesTabs(data, creatorsData) {
	const cvimgpath = 'https://comicvine.gamespot.com/a/uploads/scale_small/'

	// Шаблон картки творця
	function creatorCard(image, name, role) {
	  return `
	    <div class="info-item">
	      <div class="person-portret">
	        <img src="${image ? cvimgpath + image : ''}">
	      </div>
	      <div class="info-value">${name}
	        <div class="info-label">${role}</div>
	      </div>
	    </div>
	  `
	}

	// Генератор творців
	function generateCreators(data) {
	            console.log(data)
	  let html = ''
	  data.forEach(creator => {
	    const [rest, role] = creator.split('|')
	    const id = rest.split('-')[0]
	    const name = rest.split('-')[1]
	    const creatorData = creatorsData.find(c => c.id === parseInt(id))
	    html += `${creatorCard(creatorData?.image || '', creatorData?.ua_name || creatorData?.name || name, role)}`
	  })
	  return html
	}

	// Збираємо всі ключі, що стосуються заголовків історій
	const storyTitles = []

	// Додаємо основну історію
	storyTitles.push({
	  id: 1,
	  title: data.story_title || "Основна історія"
	})

	// Шукаємо додаткові історії в масиві storys
	if (data.storys) {
	  data.storys.forEach((story, index) => {
	    if (story.story_title) {
	      storyTitles.push({
	        id: index + 2,
	        title: story.story_title
	      })
	    }
	  })
	}
	  
	// Генеруємо HTML для вкладок
	let tabsHeaderHTML = ''
	let tabsContentHTML = ''

	storyTitles.forEach((story, index) => {
	  // Вкладки
	  tabsHeaderHTML += `<button class="tab-button ${index === 0 ? 'active' : ''}" data-tab="${story.id}">${story.id}</button>`
	            // console.log(creatorsData)
	  
	  // Контент для основної історії
	  if (index === 0) {
	    tabsContentHTML += `
	      <div class="tab-content ${index === 0 ? 'active' : ''}" id="${story.id}">
	        <h3>${story.title}</h2>
	        <div class="storys-info info-group">
	          ${generateCreators(data.creators)}
	        </div>
	      </div>
	    `
	  } else {
	    // Для додаткових історій
	    const storyData = data.storys[index - 1]
	    tabsContentHTML += `
	      <div class="tab-content" id="${story.id}">
	        <h3>${story.title}</h3>
	        <div class="storys-info info-group">
	          ${generateCreators(storyData.creators)}
	        </div>
	      </div>
	    `
	  }
	})

	return storyTitles.length > 1 
	  ? `
	    <div class="tabs-header">
	      ${tabsHeaderHTML}
	    </div>

	    ${tabsContentHTML}
	  `
	  : tabsContentHTML
}

// Функція для налаштування вкладок
export function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button')
  const tabContents = document.querySelectorAll('.tab-content')
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Деактивуємо всі вкладки
      tabButtons.forEach(btn => btn.classList.remove('active'))
      tabContents.forEach(content => content.classList.remove('active'))
      
      // Активуємо вибрану вкладку
      button.classList.add('active')
      const tabId = button.getAttribute('data-tab')
      document.getElementById(tabId).classList.add('active')
    })
  })
}