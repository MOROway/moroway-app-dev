#!/bin/bash

# Prepare metadata

cd "$(dirname "$0")/../" || exit 1

default="$(./build-libs/yq_linux_amd64 e '.default' langCodes.yml)"

# Clean up
for metadata_lang_dir in metadata/*; do
    [[ -L "$metadata_lang_dir" ]] && rm "$metadata_lang_dir"
done

# Create new links
metadata_langs=""
for metadata_lang_dir in metadata/*; do
    if [[ -d "$metadata_lang_dir" ]]; then
        clang="$(basename "$metadata_lang_dir")"
        clang_aliases=($(./build-libs/yq_linux_amd64 e ".aliases | with_entries(select(.key == \"$clang\"))| .[] | .[]" langCodes.yml))
        if [[ "$clang" == "$default" ]]; then
            clang_aliases+=("default")
        fi
        for clang_alias in "${clang_aliases[@]}"; do
            ln -s "$clang" "metadata/$clang_alias"
        done
    fi
done
