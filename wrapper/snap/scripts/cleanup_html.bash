#!/bin/bash

cd "$(dirname "$0")"/.. || exit 1

dir="www"
[[ -d "$dir" ]] && rm -r "$dir"
