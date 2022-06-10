FROM node:16

COPY . /

ENTRYPOINT ["npx", "hardhat", "node"]
