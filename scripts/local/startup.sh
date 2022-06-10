ract with the main process) then you can use bash’s job control to facilitate that. First, the wrapper script:

#!/bin/bash

# turn on bash's job control
set -m

# Start the primary process and put it in the background
npx hardhat node &

# the my_helper_process might need to know how to wait on the
# primary process to start before it does its work and returns
while (! (: </dev/tcp/localhost/8545) &> /dev/null do
    sleep 2;
done

node scripts/local/deploy.js

# now we bring the primary process back into the foreground
# and leave it there
fg %1
