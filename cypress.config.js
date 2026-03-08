const { defineConfig } = require('cypress')
const path = require('path')
const fs = require('fs')

module.exports = defineConfig({
  e2e: {
    // Base URL ¡ª change to your application's address as needed
    baseUrl: 'http://localhost:8002/default/',
    // Default command timeout (milliseconds)
    defaultCommandTimeout: 10000,
    // Viewport width
    viewportWidth: 1280,
    // Viewport height
    viewportHeight: 720,
    // Page load timeout (milliseconds)
    pageLoadTimeout: 60000,
    // Explicit support file path
    supportFile: 'cypress/support/e2e.js',

    setupNodeEvents(on, config) {
      // Ensure an explicit allure results directory is set and visible to writer
      const resultsDir = path.join(config.projectRoot || process.cwd(), 'allure-results')
      process.env.ALLURE_RESULTS_DIR = resultsDir
      config.env = config.env || {}
      config.env.ALLURE_RESULTS_DIR = resultsDir

      // Create directory early so we can verify write access
      try {
        fs.mkdirSync(resultsDir, { recursive: true })
        fs.writeFileSync(path.join(resultsDir, '__setup_test__.txt'), `allure-results dir initialized at ${new Date().toISOString()}`)
        // eslint-disable-next-line no-console
        console.log('Created allure-results directory and setup file at', resultsDir)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to create allure-results directory or write setup file:', err && err.message)
      }

      // register cypress-allure-plugin writer if available
      let writerExport = null
      try {
        // prefer the shelex plugin used elsewhere in the repo
        // log to help debugging in CI/local runs
        // eslint-disable-next-line no-console
        console.log('Attempting to register cypress-allure-plugin writer; resultsDir=' + resultsDir)
        const allureWriter = require('@shelex/cypress-allure-plugin/writer')
        writerExport = allureWriter
        if (typeof allureWriter === 'function') {
          allureWriter(on, config)
          // eslint-disable-next-line no-console
          console.log('cypress-allure-plugin writer registered')
        } else {
          // eslint-disable-next-line no-console
          console.warn('cypress-allure-plugin writer export is not a function')
        }
      } catch (err) {
        // plugin not installed or failed to load ¡ª log and continue
        // eslint-disable-next-line no-console
        console.warn('cypress-allure-plugin writer not registered:', err && err.message)
      }

      // NOTE: Some Cypress internal events (like 'test:after:run') are not supported in
      // all environments or plugin configurations and can cause "invalid plugin" errors.
      // Avoid registering optional lifecycle listeners that may not be available in this
      // environment. The writer, when registered above, should handle writing results.
      // If you need to react to test lifecycle events, use tasks or rely on the plugin hooks.

      // Add debug tasks
      on('task', {
        inspectAllureWriter() {
          try {
            if (!writerExport) return { ok: false, message: 'writer not loaded' }
            // if writerExport is a function, report that; if object, return its keys
            const info = { type: typeof writerExport }
            if (typeof writerExport === 'function') info.isFunction = true
            else info.keys = Object.keys(writerExport || {})
            return { ok: true, info }
          } catch (e) {
            return { ok: false, error: e && e.message }
          }
        },
        listAllureResults() {
          try {
            const files = fs.readdirSync(resultsDir)
            // eslint-disable-next-line no-console
            console.log('listAllureResults ->', files)
            return files
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('listAllureResults error ->', e && e.message)
            return { error: e && e.message }
          }
        },
        writeAllureSample() {
          try {
            const sample = {
              name: 'sample-test',
              status: 'passed',
              steps: [{ name: 'step-1', status: 'passed' }],
            }
            const filename = path.join(resultsDir, `sample-${Date.now()}.json`)
            fs.writeFileSync(filename, JSON.stringify(sample))
            // eslint-disable-next-line no-console
            console.log('writeAllureSample created ->', filename)
            return { created: filename }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('writeAllureSample error ->', e && e.message)
            return { error: e && e.message }
          }
        },
        writeValidAllureResult() {
          try {
            const uuid = `uid-${Date.now()}-${Math.floor(Math.random()*1000)}`
            const result = {
              uuid,
              historyId: `${uuid}`,
              status: 'passed',
              statusDetails: {},
              name: 'smoke-test-valid',
              fullName: 'Allure Smoke Test.smoke-test-valid',
              stage: 'finished',
              steps: [],
              attachments: [],
              labels: [{ name: 'framework', value: 'cypress' }],
              start: Date.now(),
              stop: Date.now() + 1
            }
            const resultFilename = path.join(resultsDir, `${uuid}-result.json`)
            fs.writeFileSync(resultFilename, JSON.stringify(result))

            const container = {
              uuid: `container-${uuid}`,
              name: 'Allure Smoke Test',
              children: [uuid]
            }
            const containerFilename = path.join(resultsDir, `container-${uuid}.json`)
            fs.writeFileSync(containerFilename, JSON.stringify(container))

            const executor = {
              name: 'local',
              type: 'local',
              url: 'http://localhost'
            }
            const executorFilename = path.join(resultsDir, 'executor.json')
            fs.writeFileSync(executorFilename, JSON.stringify(executor))

            // eslint-disable-next-line no-console
            console.log('writeValidAllureResult created ->', resultFilename, containerFilename, executorFilename)
            return { created: [resultFilename, containerFilename, executorFilename] }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('writeValidAllureResult error ->', e && e.message)
            return { error: e && e.message }
          }
        },
        writeAllureFromTest(data) {
          try {
            const uuid = `uid-${Date.now()}-${Math.floor(Math.random()*1000)}`
            const result = {
              uuid,
              historyId: `${uuid}`,
              status: data.state || 'passed',
              statusDetails: {},
              name: data.title || 'test',
              fullName: data.fullName || data.title || 'test',
              stage: 'finished',
              steps: [],
              attachments: [],
              labels: [{ name: 'framework', value: 'cypress' }],
              start: Date.now() - (data.duration || 0),
              stop: Date.now()
            }
            const resultFilename = path.join(resultsDir, `${uuid}-result.json`)
            fs.writeFileSync(resultFilename, JSON.stringify(result))

            const container = {
              uuid: `container-${uuid}`,
              name: data.testSuite || 'Cypress Suite',
              children: [uuid]
            }
            const containerFilename = path.join(resultsDir, `container-${uuid}.json`)
            fs.writeFileSync(containerFilename, JSON.stringify(container))

            // write or update executor.json
            try {
              const executor = { name: 'local', type: 'local', url: 'http://localhost' }
              const executorFilename = path.join(resultsDir, 'executor.json')
              fs.writeFileSync(executorFilename, JSON.stringify(executor))
            } catch (e) {
              // ignore
            }

            // eslint-disable-next-line no-console
            console.log('writeAllureFromTest created ->', resultFilename, containerFilename)
            return { created: [resultFilename, containerFilename] }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('writeAllureFromTest error ->', e && e.message)
            return { error: e && e.message }
          }
        }
      })

      return config
    },
  },
})
