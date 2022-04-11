# ![CESS](https://raw.githubusercontent.com/Cumulus2021/W3F-illustration/main/banner5.png)

[![Substrate version](https://img.shields.io/badge/Substrate-3.0.0-blue?logo=Parity%20Substrate)](https://substrate.dev/) 
[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/apps?logo=code-climate&style=flat-square)](https://codeclimate.com/github/polkadot-js/apps)
[![GitHub license](https://img.shields.io/badge/license-GPL3%2FApache2-blue)](#LICENSE)



# CESS-Explorer Introducation

Polkadot/Substrate UI for interacting with [*CESS*](https://github.com/CESSProject/cess) node.


Here is the source code of our blockchain explorer, which is forked from [*polkadot/apps*](https://github.com/polkadot-js/apps), and currently supports http and wss access methods.

## About The CESS
CESS is a distributed cloud data network with user friendly ledgers, novel consensus mechanism, multiple data authenticity proof schemes, and reliable network infrastructure. CESS offers data storage service with the advantages of low cost, privacy protection, security and robustness. With the implementation of CESS data confirmation and proxy re-encryption technology, CESS provides Web3.0 clients and DAPPs with trustworthy, secure and reliable data rights protection.

## Features

- Brand new UI style.
- Visually display the storage data on the CESS network through graphs.
- The CESS network supports miners to provide storage to obtain incentives.
- We can see the overview of storage miners on miner page.
- Customized search bar, support keyword search such as block hash, extrinsics hash, miner ID, account address.
- Shows the detailed information of each extrinsic.
- Display the basic information of the miner, such as controller address, beneficiary address, provided storage, total reward, and received reward.
- List specific miner-related extrinsic information.
- We have designed a separate display page for each account, which includes information such as the account address, related extrinsics, the amount of stored data, and the data list.


## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [apps-electron](packages/apps-electron/) Desktop app running [apps](packages/apps/).
- [page-accounts](packages/page-accounts/) A basic account management app.
- [page-address-book](packages/page-address-book/) A basic address management app.
- [page-democracy](packages/page-democracy/) A basic voting app, allowing votes on activate proposals and referenda.
- [page-explorer](packages/page-explorer/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [page-extrinsics](packages/page-extrinsics/) Submission of extrinsics to a node.
- [page-js](packages/page-js/) An online code editor with [@polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/api) access to the currently connected node.
- [page-settings](packages/page-settings/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [page-staking](packages/page-staking/) A basic staking management app, allowing staking and nominations.
- [page-storage](packages/page-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [page-toolbox](packages/page-toolbox/) Submission of raw data to RPC endpoints and utility hashing functions.
- [page-transfer](packages/page-transfer/) A basic account management app, allowing transfer of Units/DOTs between accounts.

In addition the following libraries are also included in the repo. These are to be moved to the [@polkadot/ui](https://github.com/polkadot-js/ui/) repository once it reaches a base level of stability and usability. (At this point with the framework being tested on the apps above, it makes development easier having it close)

- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## Technology stack
- nodejs >=10.13.0
- yarn   >=1.10.1
- react  >=17.0.2
- typescript  >=4.4.4
- echarts
- polkadot
- electron
- webpack

- docker


## Development

To start off, this repo uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via:
    ```bash
    $ git clone https://github.com/CESSProject/cess-explorer.git
    ```

2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`:
    ```bash
    $ yarn install
    ```
5. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via 
    ```bash
    $ yarn run start
    ```
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## Build & Deploy 

1. Install the dependencies by running `yarn`:
    ```bash
    $ yarn install
    ```

 2. Run build 
    ```bash
    $ yarn run build:code:win # the dist files in /packages/apps/build
    ```


## Browsers support

Modern browsers.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | 
|IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## Contributing
Thank you to all the people who already contributed to CESS-Explorer!


<a href="https://github.com/swowk"><img width="50px" src="https://avatars.githubusercontent.com/u/15166250?s=120&v=4" /></a>
<a href="https://github.com/ted-tech"><img width="50px" src="https://avatars.githubusercontent.com/u/32032991?v=4" /></a>
<a href="https://github.com/matthubin"><img width="50px" src="https://avatars.githubusercontent.com/u/7406604?v=4" /></a>
<a href="https://github.com/xfxly"><img width="50px" src="https://avatars.githubusercontent.com/u/9316508?v=4" /></a>


We very much welcome your contribution

- Use CESS-Explorer in your daily work.
- Submit [GitHub issues](https://github.com/CESSProject/cess-explorer/issues)s to report bugs or ask questions.
- Propose [Pull Request](https://github.com/CESSProject/cess-explorer/pulls) to improve our code.
