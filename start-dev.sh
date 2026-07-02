#!/bin/bash
cd /home/z/my-project
pkill -9 -f "next" 2>/dev/null
pkill -9 -f "tee" 2>/dev/null
rm -f .next/dev/lock
sleep 2
npx next dev -p 3000 &
echo "Server starting..."