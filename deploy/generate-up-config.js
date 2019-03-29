const config = require(process.argv[2])

const vars = Object.keys(process.env).reduce((acc, key) => {
  const match = key.match(/^UP_(.+)/)
  return match ? acc.concat([[match[1], process.env[key]]]) : acc
}, [])

const newConfig = {
  ...config,
  environment: vars.reduce((acc, v) => {
    acc[v[0]] = v[1]
    return acc
  }, {
    ...config.environment
  })
}

console.log(JSON.stringify(newConfig, null, 2))
