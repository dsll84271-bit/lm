#!/bin/bash
for s in "$@"; do python3 render.py $s >> render.log 2>&1; done
