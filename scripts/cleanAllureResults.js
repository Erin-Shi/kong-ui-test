const fs = require('fs')
const path = require('path')

function cleanDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error('Directory not found:', dir)
    process.exit(0)
  }
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      cleanDir(filePath)
      return
    }
    if (path.extname(file).toLowerCase() !== '.json') return
    try {
      const raw = fs.readFileSync(filePath, 'utf8')
      const obj = JSON.parse(raw)
      let changed = false
      if (obj && typeof obj === 'object' && obj.hasOwnProperty('_generatedBy')) {
        delete obj._generatedBy
        changed = true
      }
      // Also remove any top-level properties that Allure doesn't accept starting with underscore
      // but preserve recognized fields.
      for (const key of Object.keys(obj)) {
        if (key.startsWith('_')) {
          delete obj[key]
          changed = true
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8')
        console.log('Cleaned:', filePath)
      }
    } catch (e) {
      console.log('Skipping (not JSON or parse error):', filePath)
    }
  })
}

const target = process.argv[2] || './allure-results-filtered'
cleanDir(target)
console.log('Done cleaning', target)
