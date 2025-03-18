import * as Utils from '../Utils.js'
import { dataVolumes } from '../loadData.js' // Змінні з даними
// import { dataCharacters, dataConcepts, dataLocations, dataObjects, dataPeople, dataPublishers, dataTeams, dataVolumes } from './loadData.js' // Змінні з даними
import { generateStoriesTabs, setupTabs } from '../issueStorysTabs.js'
import { updateIssueFromCV } from '../../scripts/updateIssueFromCV.js'
// const fdpath = 'https://images.wikia.nocookie.net/marveldatabase/images/thumb/'
const cvimgpath = 'https://comicvine.gamespot.com/a/uploads/scale_small/'

export function pageIssue(data) {
  console.log("issueData:", data)
  let creatorsData, charsData
  // const [creatorsData, charsData] = [getCreatorsData(data), getCharactersData(data)] || [null, null]

  function getCreatorsData(data) {
    // const creatorFields = ['image_artist', 'image_artist2', 'editor_chief', 'writer', 'penciler', 'inker', 'colorist', 'letterer', 'editor', 'writer2'];
    const creators = data.creators;
    // const creatorsJson = await fetch('../json/People.json').then(res => res.json());

    const creatorIds = new Set()
    creatorIds.add(parseInt(data.editor_chief.split('-')[0]))
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

  function getCharactersData(data) { 
    const characters = data.characters;
    // const charactersJson = await fetch('../json/Characters.json').then(res => res.json());

    const characterIds = characters.map(character => parseInt(character.split(/-(.+)/)[0], 10));
    // return dataCharacters.filter(char => characterIds.includes(char.id));
  }
  // console.log("creatorsData:", creatorsData)
  // console.log("charsData:", charsData)

  // function getCreatorData(creatorName, key) {
  //   const numericId = parseInt(creatorName.split('-')[0], 10)
  //   return creatorsData[numericId][key] || null
  // }

  const editor_chief = creatorsData ? creatorsData.find(c => c.id === parseInt(data.editor_chief.split('-')[0])) : "Не вказано"
  // console.log("editor_chief:", editor_chief)

  mainContent.innerHTML = `
      <div class="issue-container">
        <!-- Ліва частина -->
        <div class="left-column">
            <!-- Постер -->
          <div id="issueCover" class="issue-poster-container">
            <img src="${data.cover_original}" class="issue-poster">
          </div>

          <!-- Основна інформація -->
          <div class="issue-info info-group">
            <div class="info-item">
              <div class="info-label">Дата релізу:</div>
              <div class="info-value">${Utils.formatDate(data.release).replace(" р.", "") || ''}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Дата публікації:</div>
              <div class="info-value">${Utils.formatMonthYear(data.publication).replace(/^./, match => match.toUpperCase()).replace(" р.", "") || ''}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Видавництво:</div>
              <div class="info-value">${data.publisher || "Marvel"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Гл. редактор:</div>
              <div class="info-value">${editor_chief?.ua_name || editor_chief?.name || "Невідомо"}</div>
            </div>
            <!-- Comic Vine ID додано -->
            ${data.cv_id ? `
            <div class="info-item">
              <div class="info-label">Comic Vine ID:</div>
              <div class="info-value">${data.cv_id}</div>
            </div>
            ` : ''}
          </div>
        </div>
          
        <!-- Права частина -->
        <div class="right-column">
          <!-- Заголовок -->
          <div class="issue-header">
              <div class="issue-title">
                <h1>${data.title || "Дивовижна Людина-павук"} <span>#${data.id}</span></h1>
                <span><i>${data.title || "Amazing Spider-Man #1"}</i></span>
              </div>
              <div class="issue-actions">
                ${data.cv_id ? `<button id="issueUpdateBtn">Оновити з CV</button>` : ''}
              </div>
          </div>
          
          <!-- Творці / Історії -->
          <div id="Storys" class="stories-tabs">
            <h2>Творці</h2>
            ${generateStoriesTabs(data, creatorsData)}
          </div>
          
          <!-- Персонажі -->
          <div id="Characters" class="characters-section">
            <h2>Персонажі</h2>
            <div class="characters-container info-group">
              ${renderCharactersSection()}
            </div>
          </div>
        </div>
      </div>

      <!-- HTML для модального вікна редагування -->
      <!-- initEditModal() -->
  `
  setupTabs()

  function renderCharactersSection() {
    const roleAbbr = {
      "main": "Головний",
      "sec": "Другорядний",
      "hero": "Герой",
      "vil": "Лиходій",
      "cameo": "Камео",
      "first": "Перша поява",
      "fb": "Флешбек",
      "dead": "Загинув",
    }

    // function getCharData(charName, key) {
    //   const id = parseInt(charName.split('-')[0], 10)
    //   return charsData[id][key] || null
    // }

    function characterCard(image, fname, earth, sname, alias, role, status) {
      return `
        <div class="info-item ${role} ${status}">
          <div class="character-portret">
            <img src="${image ? cvimgpath + image : ''}">
          </div>
          <div class="info-value">
            <div class="char-name">${alias ? "<b>" + alias + "</b>" + "<br>" + sname : "<b>" + sname + "</b>" || "Невідомо"}</div>
            <div class="char-role">${roleAbbr[role] || role}</div>
            ${status ? '<div class="char-status">' + roleAbbr[status] + '</div>':''}
          </div>
        </div>
      `
    }
    function characterCard2(image, name) {
      return `
        <div class="info-item">
          <div class="character-portret">
            <img src="${image ? cvimgpath + image : ''}">
          </div>
          <div class="info-value">
            <div class="char-name">${name || "Невідомо"}</div>
          </div>
        </div>
      `
    }

    let div = ''
    data.characters.forEach(character => {
      const regex = /[:\/|@]/
      // 1-Peter Parker:616|Peter Parker/Spider-Man|sup, dead
      if (regex.test(character)) {
        const [id, name1, name2, rolestat] = [character.split('-')[0], ...character.split('-').slice(1).join('-').split('|')]
        const [fname, earth] = name1.split(':')
        const [sname, alias] = name2.split('/')
        const [role, status] = rolestat.split(', ')
        const charData = charsData?.find(char => char.id === parseInt(id)) || {}
        // console.log("charData:",  id, fname, earth, sname, alias, roleAbbr[role])
        
        div += `${characterCard(charData.image, fname, earth, sname, alias, role, status)}`
      } else {
      // 1-Peter Parker
        const [id, name] = character.split(/-(.+)/)
        console.log(id, name)
        const charData = charsData?.find(char => char.id === parseInt(id)) || {}
        // console.log("charData:",  id, fname, earth, sname, alias, roleAbbr[role])
        
        div += `${characterCard2(charData.image, name)}`
      }
    })
    return div
  }

  issueUpdateBtn.onclick = () => updateIssueFromCV(data.cv_id)
}