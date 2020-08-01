const got = require('got')
const Errors = require('../errors')
const { URL } = require('url')

module.exports = function (config, result) {
  return new Promise((resolve, reject) => {
    config = config || {}
    config.url = config.url || 'https://html-report.restqa.io'
    const url = new URL(config.url)

    const options = {
      hostname: url.hostname,
      port: url.port,
      protocol: url.protocol,
      pathname: url.pathname,
      method: 'POST',
      json: result

    }

    got(options)
      .then(res => {
        resolve(`[HTTP HTML REPORT][${res.statusCode}] - Access to your test report : ${config.url + '/' + result.id}`)
      })
      .catch(err => {
        reject(new Errors.HTTP('HTTP HTML REPORT', err))
      })
  })
}
