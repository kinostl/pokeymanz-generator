import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import AppState from '../../appState'
import style from './style.css'
// Code-splitting is automated for `routes` directory
// We'll remember that when we add a new Header and more Search Bys

import PokemonSearch from '../../components/PokemonSearch'
import AbilityList from '../../components/AbilityList'
import MovesList from '../../components/MovesList'
import PokedexArea from '../../components/PokedexArea'
import VersionSelector from '../../components/VersionSelector'
import Loading from '../../components/Loading'
import { useSignal } from '@preact/signals'
import loadStores from '../../lib/loadStores'

const Home = () => {
  const { loading, stores } = useContext(AppState)
  const consent = useSignal(false)
  useEffect(async () => {
    consent.value = await stores.value.consent.getItem('consent')
  }, [stores.value])

  const ConsentButton = () => {
    const onClick = async () => {
      consent.value = true
      stores.value.consent.setItem('consent', true)
      stores.value = await loadStores(loading)
    }
    return (
      <div>
        <p>
          Look like its your first time here! You need to download about 13 MB
          of data to use this website.
        </p>
        <details>
          <summary>Click here to see the List of Files</summary>
          <ul>
            <li>181K ability</li>
            <li>157 category</li>
            <li>955K move</li>
            <li>1.6K move_learn_method</li>
            <li>1.8M pokemon_entry</li>
            <li>232K pokemon</li>
            <li>6.4M pokemon_move</li>
            <li>42K pokemon_name</li>
            <li>191K pokemon_version</li>
            <li>939 type</li>
            <li>2.2K version_group</li>
            <li>1.4K version</li>
            <li>1.4M sprites</li>
          </ul>
        </details>
        <button onClick={onClick}>Click here to download 13 MB of data</button>
      </div>
    )
  }

  const MainArea = () => {
    if (!consent.value) {
      return <ConsentButton />
    }
    if (loading.value) {
      return <Loading />
    }
    if (stores.value) {
      return (
        <>
          <PokemonSearch style='width:100%;' />
          <VersionSelector />
          <PokedexArea />
          <AbilityList />
          <MovesList />
        </>
      )
    }
  }

  return (
    <div class='home'>
      <h1>Welcome to Fake Pokeyman Helper</h1>
      <p>
        Type in a name, hit submit, and get a table of moves that you can copy
        into a Google Doc to get the format everyone likes.
      </p>
      <p>
        Feel free to make feature requests on the{' '}
        <a href='https://github.com/kinostl/pokeymanz-generator/issues'>
          issues page
        </a>{' '}
        or Direct Message ZoneBooth (Trick Room) on the Pokeymanz server.
      </p>
      <p>Note - You need to copy and resize images yourself.</p>
      {stores.value ? <MainArea /> : ''}
    </div>
  )
}

export default Home
