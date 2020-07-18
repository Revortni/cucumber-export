beforeEach(() => {
  jest.resetModules()
})

describe('#report - HTTP HTML REPORT', () => {

  test('Rejected if the request fail', () => {
    const Errors = require('../errors')
    const got = require('got')
    jest.mock('got')
    const gotError = new Error('got Msg')
    gotError.response = {
      statusCode: 503,
      body: {
        err: 'foo/bar'
      }
    }

    got.mockRejectedValue(gotError)

    const HttpHtmlReport= require('./http-html-report')
    const config = {
      url: 'http://my-url.test/report'
    }

    const result = {
      success: true
    }
    expect(HttpHtmlReport(config, result)).rejects.toThrow(new Errors.HTTP('HTTP HTML REPORT', gotError))
    const expectedOptions = {
      hostname: 'my-url.test',
      port: '',
      protocol: 'http:',
      pathname: '/report',
      method: 'POST',
      responseType: 'json',
      json: {
        success: true
      }
    }
    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual(expectedOptions)
  })

  test('Success Case with specific url', () => {
    const got = require('got')
    jest.mock('got')
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        url: 'http://html-report.local.dev'
      }
    })

    const HttpHtmlReport = require('./http-html-report')
    const config = {
      url: 'http://my-url.test/report',
    }

    const result = {
      success: true
    }
    expect(HttpHtmlReport(config, result)).resolves.toBe('[HTTP HTML REPORT][201] - Access to your test report : http://html-report.local.dev')

    const expectedOptions = {
      hostname: 'my-url.test',
      port: '',
      protocol: 'http:',
      pathname: '/report',
      method: 'POST',
      responseType: 'json',
      json: {
        success: true
      }
    }
    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual(expectedOptions)
  })

  test('Success Case using default html report from restqa', () => {
    const got = require('got')
    jest.mock('got')
    got.mockResolvedValue({
      statusCode: 201,
      body: {
        url: 'https://html-report.restqa.io/test'
      }
    })

    const HttpHtmlReport = require('./http-html-report')
    const config = {
    }

    const result = {
      success: true
    }
    expect(HttpHtmlReport(config, result)).resolves.toBe('[HTTP HTML REPORT][201] - Access to your test report : https://html-report.restqa.io/test')

    const expectedOptions = {
      hostname: 'html-report.restqa.io',
      port: '',
      protocol: 'https:',
      pathname: '/',
      method: 'POST',
      responseType: 'json',
      json: {
        success: true
      }
    }
    expect(got.mock.calls.length).toBe(1)
    expect(got.mock.calls[0][0]).toEqual(expectedOptions)
  })
})
