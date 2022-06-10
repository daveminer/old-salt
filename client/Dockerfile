FROM node:16-alpine

ENV PORT 3000

WORKDIR /usr/src/app

COPY . /usr/src/app
COPY client /usr/src/app

RUN npm install --save-dev hardhat typescript @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle @openzeppelin/hardhat-upgrades hardhat-abi-exporter @openzeppelin/contracts-upgradeable

COPY ./scripts/local/deploy.js /usr/src/app/scripts/local/deploy.js

RUN ls -la

RUN node scripts/local/deploy.js

WORKDIR /usr/src/app/client

RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
