import localforage from 'localforage'
import loadSprites from './loadSprites'

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

const objectFilterKeys = async (obj, fn) => {
  const res = await Promise.all(
    Object.entries(obj).map(async ([k, v], i) => [k, await fn(v, k, i)])
  )
  return res.filter(([k, v]) => v === true).map(([k, v]) => k)
}

async function downloadData (data) {
  const res = await fetch(`./assets/data/${data}.json`)
  return await res.json()
}

async function createStores () {
  return Object.fromEntries(
    await Promise.all(
      [
        'pokemon',
        'pokemon_entry',
        'pokemon_move',
        'pokemon_name',
        'pokemon_version',
        'ability',
        'category',
        'move',
        'move_learn_method',
        'type',
        'version',
        'version_group',
        'sprite',
        'consent'
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

async function populateStore (data, store) {
  return Promise.allSettled(data.map(row => store.setItem(`${row.id}`, row)))
}

async function loadStores (loading) {
  //TODO make this conditional based on a version number or something.
  //TODO give the user an option to download the bundle again for whatever reason.

  const stores = await createStores()
  const hasConsent = await stores.consent.getItem('consent')
  if (!hasConsent) {
    await stores.consent.setItem('consent', false)
    return stores
  }

  const emptyStores = await objectFilterKeys(stores, async (store, name) => {
    const length = await store.length()
    return length === 0
  })

  if (emptyStores.length > 0 && hasConsent) {
    await Promise.allSettled(
      emptyStores
        .map(emptyStore => ({
          key: emptyStore,
          store: stores[emptyStore]
        }))
        .map(async ({ key, store }) => {
          loading.value = {
            ...loading.value,
            [key]: `Downloading ${key}`
          }
          if (key !== 'sprite') {
            const data = await downloadData(key)
            await populateStore(data, store)
          } else {
            await loadSprites(store)
          }
          loading.value = {
            ...loading.value,
            [key]: false
          }
        })
    )
  }

  loading.value = false
  return stores
}

export default loadStores
