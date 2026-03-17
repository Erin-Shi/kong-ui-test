# Kong UI Test

Lightweight Cypress test suite for Kong UI with Allure reporting and GitHub Pages deployment.

## Overview

- Tests written with Cypress (v15).
- Allure reporting via `@shelex/cypress-allure-plugin`.
- Optional test filtering using `cypress-grep` (install if you want to run tag-filtered tests).
- CI workflow builds and publishes generated Allure HTML reports to the `gh-pages` branch under `reports/<run_number>/`.

## Tests included

The repository contains E2E test specs under `cypress/e2e/` (examples):

- `service-create.cy.js` — service creation scenarios
- `route-error.cy.js` — route/error handling scenarios

(See `cypress/e2e/` for the full list in this repo.)

## Requirements

- Node.js 18.x (workflow pins `18.16.0`)
- npm
- Java runtime (for local Allure CLI usage)
- Recommended: run `npm install` / `npm ci` from project root

Notes on `cypress-grep`: the plugin has a peer dependency that may conflict with newer Cypress versions. If you install it locally, you may need to run:

```
npm install --save-dev cypress-grep --legacy-peer-deps
```

CI is configured to use `npm ci` with `legacy-peer-deps` in the workflow.

## Install

1. Clone the repo

```
git clone https://github.com/<owner>/<repo>.git
cd <repo>
```

2. Install dependencies (generate `package-lock.json`):

```
npm install --legacy-peer-deps
```

 or if you prefer a clean install using the lockfile after it exists:

```
rm -rf node_modules
npm ci
```

## Run tests locally

- Open Cypress UI:

```
npm run cypress:open
```

- Run headless and produce JUnit results:

```
npm run cypress:run:ci
```

- Run tests + generate Allure HTML report in one step:

```
npm run cypress:run:ci:allure
```

## Filter tests with tags (cypress-grep)

You can tag tests either by including the tag in the test title or by using the `tags` option on the test. Both are supported by this repo's tooling.

Examples:

```js
// tag in title
it('creates service @service @smoke', () => { ... })

// or tags in options (recommended for clarity)
it('creates service', { tags: ['@service', '@smoke'] }, () => { ... })
```

Running by tag ¡ª two options are provided in this repo:

1) Preferred: use `scripts/run-by-tag.js` (defaults to scanning specs and running only matching spec files)

- Run by single tag (scan mode, default):

```
node scripts/run-by-tag.js service
# or with @ prefix
node scripts/run-by-tag.js @service
```

- Run with multiple tags (OR):

```
node scripts/run-by-tag.js service,smoke
```

- If you prefer runtime filtering (use cypress-grep to filter tests and specs at runtime) use `--no-scan`:

```
node scripts/run-by-tag.js service --no-scan
# which executes: npx cypress run --env "grepTags=@service,grepFilterSpecs=true"
```

2) Direct cypress-grep CLI (PowerShell quoting note):

- In PowerShell you must quote the entire `--env` value to avoid `@` being interpreted:

```
npx cypress run --env "grepTags=@service,grepFilterSpecs=true,grepDebug=true"
```

- In bash / cmd you can use:

```
npx cypress run --env grepTags=@service,grepFilterSpecs=true,grepDebug=true
```

`grepFilterSpecs=true` tells the plugin to skip specs that have no matching tests; if you want the plugin to only filter tests but still run specified specs, set `grepFilterSpecs=false`.

## Allure report

- Raw Allure JSON results are written to `./allure-results`.
- Generate HTML report locally:

```
npm run allure:generate
```

- Open report locally:

```
npm run allure:open
```

CI workflow also generates the report and deploys it to `gh-pages` under `reports/<run_number>/` and creates a simple `index.html` listing runs.

## CI (GitHub Actions)

Workflow: `.github/workflows/cypress.yml`
- Steps: checkout, setup node, start app (docker compose), run Cypress, prepare Allure results, generate report, deploy to `gh-pages`, and upload artifacts.
- The workflow creates `allure-report` and pushes it to `gh-pages/reports/${{ github.run_number }}`.

Ensure Pages is enabled (Settings --> Pages) and targeting the `gh-pages` branch for the site to be visible.

## Troubleshooting

- If tests fail during bundling with `Module not found: Can't resolve 'cypress-grep'`, either install `cypress-grep` locally or keep the optional require in `cypress/support/e2e.js` (which is present in this repo) and run without it.
- If `allure-report` is not created by CI: verify `allure-results` contains JSON files (CI debug logs include `ls -la` and timestamps) and that Java is available in the runner.
- Use debug tasks available in `cypress.config.js` via `cy.task('listAllureResults')`, `writeAllureSample`, or `writeValidAllureResult` to validate writer behavior.

## Files you may want to inspect

- `cypress/support/e2e.js` — support hooks, Allure plugin registration, optional grep require, fallback writer
- `cypress.config.js` — config and Node event setup, Allure results directory and debug tasks
- `.github/workflows/cypress.yml` — CI workflow that runs tests and deploys the Allure report
- `package.json` — npm scripts: `cypress:run:ci`, `cypress:run:ci:allure`, `allure:generate`, `allure:open`, `cypress:run:tag`

## Contributing

- Run tests locally and ensure `allure-results` and `allure-report` are generated before opening a PR.
- Do not commit `allure-results` or `allure-report` directories (they should be ignored).

---
Generated README for this repo. Amend owner/repo URLs as needed.
