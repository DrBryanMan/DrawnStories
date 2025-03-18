export async function loadData(category, name) {
  // name = name.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_')
  try {
    const path = `json/${category}/${name}.json`;
    return await fetch(path).then(res => res.json())
  }
  catch (error) {
      console.error(`❌ Файл не знайдено.`, error.message);
      throw error;
  }
}

// export let [dataCharacters, dataConcepts, dataLocations, dataObjects, dataPeople, dataPublishers, dataTeams, dataVolumes] = [[],[],[],[],[],[],[],[]]
// export let dataVolumes
export let dataVolumes, dataCharacters, dataPeople, dataPublishers

// Отримуємо всі дані
export async function loadDBData() {
  // dataVolumes = await fetch('json/Volumes Test.json').then(res => res.json())
  [dataCharacters, dataPeople, dataPublishers, dataVolumes] = await Promise.all([
    fetch('json/Characters Test.json').then(res => res.json()),
    // fetch('json/Concepts.json').then(res => res.json()),
    // fetch('json/Locations.json').then(res => res.json()),
    // fetch('json/Objects.json').then(res => res.json()),
    fetch('json/People.json').then(res => res.json()),
    fetch('json/Publishers.json').then(res => res.json()),
    // fetch('json/Teams.json').then(res => res.json()),
    fetch('json/Volumes Test.json').then(res => res.json()),
  ])
  // dataVolumes = dataVolumes.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
  // allTeams = teamData.sort((a, b) => a.name.localeCompare(b.name))
}
