import localforage from 'localforage'
const objectMap = async (obj, fn) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(obj).map(async ([k, v], i) => [k, await fn(v, k, i)])
    )
  )

const objectForEach = async (obj, fn) =>
  await Promise.allSettled(
    Object.entries(obj).map(async ([k, v], i) => [k, await fn(v, k, i)])
  )

async function downloadDatas () {
  const [
    pokemons,
    pokemon_entries,
    pokemon_moves,
    pokemon_names,
    pokemon_versions,
    abilities,
    categories,
    moves,
    types,
    versions,
    version_groups
  ] = await Promise.all([
    fetch(`./assets/data/pokemon/index.json`),
    fetch(`./assets/data/pokemon/entry.json`),
    fetch(`./assets/data/pokemon/move.json`),
    fetch(`./assets/data/pokemon/name.json`),
    fetch(`./assets/data/pokemon/version.json`),
    fetch(`./assets/data/ability.json`),
    fetch(`./assets/data/category.json`),
    fetch(`./assets/data/move.json`),
    fetch(`./assets/data/type.json`),
    fetch(`./assets/data/version.json`),
    fetch(`./assets/data/version_group.json`)
  ])

  const req = {
    pokemons,
    pokemon_entries,
    pokemon_moves,
    pokemon_names,
    pokemon_versions,
    abilities,
    categories,
    moves,
    types,
    versions,
    version_groups
  }

  return await objectMap(req, async o => await o.json())
}

async function createStores () {
  return Object.fromEntries(
    await Promise.all(
      [
        'pokemons',
        'pokemon_entries',
        'pokemon_moves',
        'pokemon_names',
        'pokemon_versions',
        'abilities',
        'categories',
        'moves',
        'types',
        'versions',
        'version_groups'
      ].map(async storeName => [
        storeName,
        await localforage.createInstance({
          name: 'pokedex',
          storeName
        })
      ])
    )
  )
}

async function populateStores (datas, stores) {
  await objectForEach(datas, async (rows, table) => {
    await Promise.all(
      rows.map(async row => {
        await stores[table].setItem(`${row.id}`, row)
      })
    )
  })
}

async function loadStores () {
  //TODO make this conditional based on a version number or something.
  //TODO give the user an option to download the bundle again for whatever reason.

  const stores = await createStores()
  const emptyStores = []
  await objectForEach(stores, async (store, name) => {
    const length = await store.length()
    if (length === 0) emptyStores.push(name)
  })
  if (emptyStores.length > 0) {
    const datas = await downloadDatas()
    await populateStores(datas, stores)
  }
  return stores
}

export default loadStores
