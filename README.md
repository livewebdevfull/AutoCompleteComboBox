### Introduction

A Combo Box is a component that combines a _text box_ with a _dropdown list_, allowing the users to choose among a list of a long list of mutually exclusive values.

### Objective

The goal of this first phase is to implement the above component:

- [x] no high-level primitives, e.g. without [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist), without pre-made React components
- [x] reproduce as much of the UX of Chrome's URL bar as possible.
- [x] use React hooks, no class components
- [x] be written in TypeScript, 
- [x] be performant, it can render 300 options without virtualization
- [x] be accessible, end-users could only use the keyboard, see [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#combobox) for guidance. Their [examples](https://www.w3.org/TR/wai-aria-practices/examples/combobox/combobox-autocomplete-both.html) might be the most helpful.
- [x] looks great, has a beautiful UI
- [x] make the existing test pass, add tests for edge cases
- [x] has no lintint errors (`yarn prettier && yarn lint && yarn typescript`)
- [x] has an ergonomic API

## Work environment
- clone the repo: `git clone git@github.com:mui/react-technical-challenge.git`
- install the dependencies: `yarn`
- start Next.js: `yarn start`
- Copy files to docs\pages\components folder.
- open http://0.0.0.0:3003/components/phase1/

The tests in the file can be run with this command: `yarn t ComboBox`.
