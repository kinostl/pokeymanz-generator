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

async function loadPokemon () {
  //TODO make this conditional based on a version number or something.
  //TODO give the user an option to download the bundle again for whatever reason.
  await localforage.clear()
  const [
    pokemons,
    pokemon_entries,
    pokemon_moves,
    pokemon_names,
    abilities,
    categories,
    moves,
    types
  ] = await Promise.all([
    fetch(`./assets/data/pokemon/index.json`),
    fetch(`./assets/data/pokemon/entry.json`),
    fetch(`./assets/data/pokemon/move.json`),
    fetch(`./assets/data/pokemon/name.json`),
    fetch(`./assets/data/ability.json`),
    fetch(`./assets/data/category.json`),
    fetch(`./assets/data/move.json`),
    fetch(`./assets/data/type.json`)
  ])

  const req = {
    pokemons,
    pokemon_entries,
    pokemon_moves,
    pokemon_names,
    abilities,
    categories,
    moves,
    types
  }

  const res = await objectMap(req, async o => await o.json())
  await objectForEach(res, async (rows, table) => {
    await Promise.all(
      rows.map(async row => {
        await localforage.setItem(`${table}/${row.id}`, row)
      })
    )
  })

  return Object.keys(req)
}

export default loadPokemon

//await localforage.setItem()
