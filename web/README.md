# Polydodo web client

This web app aims to offer a comprehensive guide on **how to record polysomnographic EEG data from home** with an OpenBCI, a form to **upload sleep data** to our classifier and an **interactive scrolly-telling visualization** to observe the night of sleep. Finally, it is possible to export the classifier results for further use.

This app was designed on top of React.js and the data visualizations were created using D3.js.

## Getting started

### Prerequisites:
- Install the latest stable version of  [Yarn package manager](https://classic.yarnpkg.com/lang/en/).
- Install the latest LTS version of [Node.js](https://nodejs.org/en/download/).
- We will also be needing [Python](https://www.python.org/downloads/).
  - We recommend installing Python 3 as it is the version required for the backend.

### Setup
Open VS Code workspace and then open a new terminal for the web directory. 

Install the required node modules using:
`yarn install`

Aftwards, it is possible to run the web client using:
`yarn run start`
