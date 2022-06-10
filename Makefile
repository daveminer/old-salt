chain:
	npx hardhat node

contract:
	npx hardhat run scripts/local/deploy.js

game:
	cd client; \
	pwd; \
	yarn dev
