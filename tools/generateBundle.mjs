//# Issue https://github.com/kinostl/pokeymanz-generator/issues/18

import util from 'node:util'
import child_process from 'node:child_process'
import fs from 'node:fs/promises'
import convert from 'convert'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const execFile = util.promisify(child_process.execFile)

const POKEMON_DATA = `${__dirname}/./deps/api-data/data/api/v2/`
const OUTPUT_FOLDER = `${__dirname}/../src/assets/data/`

const colorTable = {
  physical: '#c92112',
  special: '#4f5870',
  status: '#8c888c',
  normal: '#c6c6a7',
  fighting: '#d67873',
  flying: '#c6b7f5',
  poison: '#c183c1',
  ground: '#ebd69d',
  rock: '#d1c17d',
  bug: '#c6d16e',
  ghost: '#a292bc',
  steel: '#d1d1e0',
  fire: '#f5ac78',
  water: '#9db7f5',
  grass: '#a7db8d',
  electric: '#fae078',
  psychic: '#fa92b2',
  ice: '#bce6e6',
  dragon: '#a27dfa',
  dark: '#a29288',
  fairy: '#f4bdc9'
}

async function getDefinition (definition) {
  const files = await fs.readdir(`${POKEMON_DATA}/${definition}/`, {
    withFileTypes: true
  })

  const jqPromises = files
    .filter(file => file.isDirectory())
    .map(async file => {
      const { stdout } = await execFile('jq', [
        '-f',
        `${__dirname}/get-${definition}-definitions.jq`,
        `${POKEMON_DATA}/${definition}/${file.name}/index.json`
      ])
      const _json = JSON.parse(stdout)
      return _json
    })
  const jqRes = await Promise.all(jqPromises)
  return jqRes
}

async function getPokemonDetails (detail) {
  const files = await fs.readdir(`${POKEMON_DATA}/pokemon-species/`, {
    withFileTypes: true
  })

  const jqPromises = files
    .filter(file => file.isDirectory())
    .map(async file => {
      const { stdout } = await execFile('jq', [
        '-f',
        `${__dirname}/get-pokemon-${detail}.jq`,
        `${POKEMON_DATA}/pokemon-species/${file.name}/index.json`
      ])
      const _json = JSON.parse(stdout)
      return _json
    })
  const jqRes = await Promise.all(jqPromises)
  return jqRes
}

async function getPokemonNames () {
  const names = await getPokemonDetails('name')
  return names.sort((a, b) => a.order - b.order)
}

async function getPokemonCanvas () {
  const files = await fs.readdir(`${POKEMON_DATA}/pokemon/`, {
    withFileTypes: true
  })

  const jqPromises = files
    .filter(file => file.isDirectory())
    .map(async file => {
      const { stdout } = await execFile('jq', [
        '-f',
        `${__dirname}/get-pokemon.jq`,
        `${POKEMON_DATA}/pokemon/${file.name}/index.json`
      ])
      const _json = JSON.parse(stdout)
      return _json
    })
  const jqRes = await Promise.all(jqPromises)
  return jqRes
}

async function getPokemonMoves () {
  const files = await fs.readdir(`${POKEMON_DATA}/pokemon/`, {
    withFileTypes: true
  })

  const jqPromises = files
    .filter(file => file.isDirectory())
    .map(async file => {
      const { stdout } = await execFile('jq', [
        '-f',
        `${__dirname}/get-pokemon-move.jq`,
        `${POKEMON_DATA}/pokemon/${file.name}/index.json`
      ])
      const _json = JSON.parse(stdout)
      return _json
    })
  const jqRes = await Promise.all(jqPromises)
  return jqRes
}

function defineColors (data) {
  data.forEach(datum => {
    datum.color = colorTable[datum.id]
  })
  return data
}

function definePokemon (pokemons, categories) {
  pokemons.forEach(pokemon => {
    pokemon.details.category = categories[pokemon.id]

    const heightInMeters = convert(pokemon.details.height, 'decimeters')
      .to('meters')
      .toFixed(1)
    const heightInInches = convert(pokemon.details.height, 'decimeters')
      .to('inches')
      .toFixed(0)
    const heightInFeet = Math.floor(heightInInches / 12)
    const andInches = heightInInches - heightInFeet * 12
    const weightInLb = convert(pokemon.details.weight, 'hectograms')
      .to('lb')
      .toFixed(1)
    const weightInKg = convert(pokemon.details.weight, 'hectograms')
      .to('kg')
      .toFixed(1)
    pokemon.details.height = {
      meters: heightInMeters,
      feet: heightInFeet,
      andInches: andInches
    }
    pokemon.details.weight = {
      lb: weightInLb,
      kg: weightInKg
    }
  })
  return pokemons
}

function definePokemonVersion (pokemon_moves) {
  //We define it by the moves because its the only thing reliable for this.
  return pokemon_moves.map(pokemon => ({
    id: pokemon.id,
    versions: Object.keys(pokemon.moves)
  }))
}

const [
  ability,
  category_canvas,
  move,
  type_canvas,
  version,
  version_group,
  pokemon_canvas,
  pokemon_move,
  pokemon_category_canvas,
  pokemon_entry,
  pokemon_name
] = await Promise.all([
  getDefinition('ability'),
  getDefinition('move-damage-class'),
  getDefinition('move'),
  getDefinition('type'),
  getDefinition('version'),
  getDefinition('version-group'),
  getPokemonCanvas(),
  getPokemonMoves(),
  getPokemonDetails('category'),
  getPokemonDetails('entry'),
  getPokemonNames()
])

const category = defineColors(category_canvas)
const type = defineColors(type_canvas)
const pokemon_category = pokemon_category_canvas.reduce(
  (obj, item) => ((obj[item.id] = item.category), obj),
  {}
)
const pokemon = definePokemon(pokemon_canvas, pokemon_category)
const pokemon_version = definePokemonVersion(pokemon_move)

await Promise.all([
  fs.writeFile(`${OUTPUT_FOLDER}/ability.json`, JSON.stringify(ability)),
  fs.writeFile(`${OUTPUT_FOLDER}/category.json`, JSON.stringify(category)),
  fs.writeFile(`${OUTPUT_FOLDER}/type.json`, JSON.stringify(type)),
  fs.writeFile(`${OUTPUT_FOLDER}/move.json`, JSON.stringify(move)),
  fs.writeFile(`${OUTPUT_FOLDER}/version.json`, JSON.stringify(version)),
  fs.writeFile(
    `${OUTPUT_FOLDER}/version_group.json`,
    JSON.stringify(version_group)
  ),
  fs.writeFile(`${OUTPUT_FOLDER}/pokemon/index.json`, JSON.stringify(pokemon)),
  fs.writeFile(
    `${OUTPUT_FOLDER}/pokemon/move.json`,
    JSON.stringify(pokemon_move)
  ),
  fs.writeFile(
    `${OUTPUT_FOLDER}/pokemon/entry.json`,
    JSON.stringify(pokemon_entry)
  ),
  fs.writeFile(
    `${OUTPUT_FOLDER}/pokemon/name.json`,
    JSON.stringify(pokemon_name)
  ),
  fs.writeFile(
    `${OUTPUT_FOLDER}/pokemon/version.json`,
    JSON.stringify(pokemon_version)
  )
])
