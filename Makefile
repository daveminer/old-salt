chain:
	npx hardhat node

contract:
	npx hardhat run --network localhost scripts/local/deploy.js

game:
	cd client; \
	pwd; \
	yarn dev

test:
	npx hardhat test
