export default config => {
  if (config.mode === 'production') {
    config.output.publicPath = 'https://kinostl.github.io/pokeymanz-generator/'
  }
}
