#!/bin/bash

dir=$(dirname "$0")"/../www"
rm -r "$dir"/*
echo "www-dir content is auto-generated from moroway-snapp subdir" >"$dir"/README.md
