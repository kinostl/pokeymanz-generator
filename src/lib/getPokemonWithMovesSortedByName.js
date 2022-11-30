import { Pokedex } from 'pokeapi-js-wrapper'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import toPairs from 'lodash/toPairs'

const P = new Pokedex()
const getMovesSortedByName = async pokemon => {
  const res = await P.getPokemonByName(pokemon)
  const sortedMoves = groupBy(
    res.moves,
    o =>
      o.version_group_details[o.version_group_details.length - 1]
        .move_learn_method.name
  )
  const sortedMoveUrls = mapValues(sortedMoves, o =>
    o.map(entry => entry.move.url)
  )
  const sortedMovePromises = toPairs(sortedMoveUrls).map(async pair => [
    pair[0],
    await P.resource(`api/v2/move-learn-method/${pair[0]}`),
    await P.resource(pair[1])
  ])
  const sortedMoveRes = await Promise.all(sortedMovePromises)
  const getEnglish = o => o.language.name === 'en'
  const moveOrder = ['level-up', 'machine', 'egg']
  const sortedMovesByName = sortedMoveRes
    .map(method => [
      method[0],
      method[1].names.filter(getEnglish)[0].name,
      method[1].descriptions.filter(getEnglish)[0].description,
      method[2]
        .map(o => ({
          ...o,
          name: o.names.filter(getEnglish)[0].name,
          effect: o.flavor_text_entries.filter(getEnglish).reverse()[0]
            .flavor_text
        }))
        .sort((a, b) =>
          a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        )
    ])
    .sort((a, b) => {
      const aRef = moveOrder.indexOf(a[0])
      const bRef = moveOrder.indexOf(b[0])
      if (aRef > -1 && bRef > -1) {
        return aRef - bRef
      }
      if (aRef > -1 && bRef < 0) {
        return -1
      }
      if (bRef > -1 && aRef < 0) {
        return 1
      }
      return 0
    })

  return {
    ...res,
    moves: sortedMovesByName
  }
}

export default getMovesSortedByName