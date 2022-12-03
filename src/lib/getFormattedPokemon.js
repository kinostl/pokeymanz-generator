import { Pokedex } from 'pokeapi-js-wrapper'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import toPairs from 'lodash/toPairs'
import uniq from 'lodash/uniq'

const P = new Pokedex()
const getEnglish = o => o.language.name === 'en'
const getFormattedMoves = async pokemon => {
  const moves = await getSortedMoves(pokemon)
  const moveOrder = ['level-up', 'machine', 'egg']

  const formattedMoves = moves
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

  return formattedMoves
}

const getSortedMoves = async pokemon => {
  const sortedMoves = groupBy(
    pokemon.moves,
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
  return sortedMoveRes
}

const getFormattedAbilities = async pokemon => {
  const AbilityUrls = pokemon.abilities.map(o => o.ability.url)
  const Abilities = await P.resource(AbilityUrls)
  const FormattedAbilities = Abilities.map(o => [
    o.names.filter(getEnglish).reverse()[0].name,
    o.flavor_text_entries.filter(getEnglish).reverse()[0].flavor_text
  ])
  return FormattedAbilities
}

const getFormattedSpecies = async pokemon => {
  const species = await P.resource(pokemon.species.url)
  const flavor_text_entries = species.flavor_text_entries
    .filter(getEnglish)
    .reverse()
  const flavor_text = [
    flavor_text_entries[0].flavor_text,
    flavor_text_entries[1].flavor_text
  ]
  const genera_entries = species.genera.filter(getEnglish).reverse()
  const genera = genera_entries[0].genus
  return {
    ...species,
    flavor_text,
    genera
  }
}

const getFormattedVersionGroups = async pokemon => {
  const game_indices = pokemon.game_indices.map(
    game_indice => game_indice.version.url
  )
  const games = await P.resource(game_indices)
  const version_groups = games.map(game => game.version_group.url)
  const version_group_details = await P.resource(uniq(version_groups))
  const formattedVgPromises = version_group_details.reverse().map(async vg => {
    const version_name = vg.name
    const versions_urls = vg.versions.map(version => version.url)
    const generation_url = vg.generation.url
    const [generation_res, versions_res] = await Promise.all([
      P.resource(generation_url),
      P.resource(versions_urls)
    ])
    const version_names = versions_res.map(
      o => o.names.filter(getEnglish).reverse()[0].name
    )
    const generation_name = generation_res.names
      .filter(getEnglish)
      .reverse()[0].name
    return [version_name, `${version_names.join('/')} (${generation_name})`]
  })
  const formatted_version_groups = await Promise.all(formattedVgPromises)
  return formatted_version_groups
}

const getFormattedPokemon = async pokemonName => {
  const pokemon = await P.getPokemonByName(pokemonName)
  const [
    formattedMoves,
    formattedSpecies,
    formattedAbilities,
    formattedVersionGroups
  ] = await Promise.all([
    getFormattedMoves(pokemon),
    getFormattedSpecies(pokemon),
    getFormattedAbilities(pokemon),
    getFormattedVersionGroups(pokemon)
  ])

  return {
    ...pokemon,
    moves: formattedMoves,
    species: formattedSpecies,
    abilities: formattedAbilities,
    version_groups: formattedVersionGroups
  }
}

export default getFormattedPokemon
