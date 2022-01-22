#!/bin/bash

npm install
node utils/melangerATrouver.js
node utils/majATrouver.js
tsc
cp -r public/* /var/www/sutom2/
cp -r js/ /var/www/sutom2/
