#!/bin/bash

# Sync language code

cd "$(dirname "$0")/../" || exit 1

# Add new keys
langCodes=()
for file in strings/strings-*.json; do
	langCode="$(echo "$(basename "$file")" | sed 's/^strings-//;s/\.json$//')"
	if [[ "$(./build-libs/yq_linux_amd64 e ".aliases .\"$langCode\"" langCodes.yml)" == "null" ]]; then
		./build-libs/yq_linux_amd64 -i e ".aliases .\"$langCode\" = []" langCodes.yml
	fi
	langCodes+=($langCode)
done

# Delete obsolete keys
while read -r ymlLangCode; do
	if [[ ! "${langCodes[@]}" =~ "$ymlLangCode" ]]; then
		./build-libs/yq_linux_amd64 -i e "del(.aliases.\"$ymlLangCode\")" langCodes.yml
	fi
done < <(./build-libs/yq_linux_amd64 e ".aliases | keys[]" langCodes.yml)

# Formatting
./build-libs/yq_linux_amd64 -I4 -i e "sort_keys(.aliases)" langCodes.yml
