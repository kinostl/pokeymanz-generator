// Need to figure out the best way to automated building this into the assets folder or what.
// Also probably gonna need to create a loader for this.
// maybe show like
// ```
// 'Loading text...'
// 'Loading images...'
// ```

import untar from 'js-untar'
import localforage from 'localforage'

async function downloadSprites () {
  /*
  const res = await fetch(`./assets/sprites.tar`)
  return await res.arrayBuffer()
  */
  return null
}

async function loadSprites () {
  const [store, sprites] = await Promise.all([
    localforage.createInstance({
      name: 'pokedex',
      storeName: 'sprite'
    }),
    downloadSprites()
  ])

  /*
  await untar(sprites).progress(sprite => {
    store.setItem(sprite.name, sprite.blob)
  })
  */

  return store
}

export default loadSprites
