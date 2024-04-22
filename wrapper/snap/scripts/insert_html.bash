#!/bin/bash

function loop() {
	files=("$1"/*)
	for file in "${files[@]}"; do
		if [[ -f "$file" ]] && [[ "$file" =~ .html ]]; then
			sed -i 's#\(</title>\)#\1\n<meta http-equiv="Content-Security-Policy" content="default-src '"'self'; img-src 'self' https://$domain; connect-src 'self' https://$domain wss://$domain"';">\n#' "$file"
		elif [[ -d "$file" ]]; then
			$(loop "$file")
		fi
	done
}

cd "$(dirname "$0")"/.. || exit 1

domain=$(cat "app_domain.txt")
app_dir="moroway-snapp"
build_dir="build"
dir="www"
[[ -d "$dir" ]] && rm -r "$dir"
mkdir "$dir"
cp -pr "$app_dir"/* "$dir"
cp -pr "$build_dir"/* "$dir"
$(loop "$dir")
