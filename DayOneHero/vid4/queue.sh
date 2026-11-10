#!/bin/bash
# waits for any running render, then renders the given segments in order
cd /home/user/lm/DayOneHero/vid4
while pgrep -f "render.py" > /dev/null; do sleep 5; done
for s in "$@"; do python render.py $s 4 > render_$s.log 2>&1; done
