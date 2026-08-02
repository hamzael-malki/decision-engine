Tests folder layout and usage

Overview

This folder groups the various test artifacts and helper scripts used by the project.

Structure

- tests/
  - unit/                # Unit tests (JS files runnable with `node`)
  - integration/         # Integration tests (reserved)
  - e2e/                 # End-to-end tests (reserved)
  - snapshots/html/      # Generated HTML snapshots
  - fixtures/            # Example inputs and sample outputs
  - tools/               # Generators and helper scripts
    - python/            # Python snapshot generator
    - node/              # Node/JS snapshot generator
  - helpers/             # Helper utilities for tests

Quick commands

- Run unit tests (simple runner):
  npm run test:unit

- Regenerate snapshots (Python generator):
  npm run test:snapshots

- Regenerate snapshots (Node generator):
  npm run generate-snapshots-node

Notes

- The repo uses a lightweight custom test runner (node scripts in tests/unit/) to avoid adding heavy test frameworks.
- If you move files, update scripts in package.json accordingly.
- CI can use `npm run test:snapshots` to regenerate or validate snapshots; prefer comparing outputs rather than auto-committing them.
