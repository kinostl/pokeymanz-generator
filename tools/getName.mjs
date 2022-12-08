import { readFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

let rawdata = readFileSync(`${__dirname}/pokemon_name_id_map.json`)
let pokemon_db = JSON.parse(rawdata)

console.log(pokemon_db[process.argv[2]])
