chain:
	npx hardhat node

deploy:
	npx hardhat run scripts/local/deploy.js

game:
	cd client; \
	pwd; \
	yarn dev
