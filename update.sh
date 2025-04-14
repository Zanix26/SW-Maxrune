#!/bin/bash
cd /var/www/sw-maxrune
git pull origin main
cd /var/www/sw-maxrune/client
npm install
npm run build
cd /var/www/sw-maxrune/server
npm install
pm2 restart sw-backend
pm2 restart sw-frontend