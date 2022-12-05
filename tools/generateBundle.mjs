#!/bin/bash

// # eventually the json should be generated as a batch in here with the sprites and everything being put into assets as a bundle that can be loaded by localforge so that users can use the app offline and to prevent too much downloading.
//# Issue https://github.com/kinostl/pokeymanz-generator/issues/18

import util from 'node:util'
import child_process from 'node:child_process'
import fs from 'node:fs/promises'

const execFile = util.promisify(child_process.execFile)

const POKEMON_DATA = './deps/api-data/data/api/v2/'
const OUTPUT_FOLDER = '../src/assets/data/'

let ability = {}

async function getAbility () {
  const files = await fs.readdir(`${POKEMON_DATA}/ability/`, {
    withFileTypes: true
  })

  const jqPromises = files
    .filter(file => file.isDirectory())
    .map(async file => {
      const { stdout } = await execFile('jq', [
        '-f',
        'getAbilityDefinitions.jq',
        `${POKEMON_DATA}/ability/${file.name}/index.json`
      ])
      const _json = JSON.parse(stdout)
      return _json
    })
  const jqRes = await Promise.all(jqPromises)
  fs.writeFile(`${OUTPUT_FOLDER}/ability.json`, JSON.stringify(jqRes))
}

await Promise.all([getAbility()])
