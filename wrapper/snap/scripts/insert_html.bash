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
domain=$(cat "$(dirname "$0")/../app_domain.txt")
odir="$(dirname "$0")/../moroway-snapp"
dir="$(dirname "$0")/../www"
[[ -d "$dir" ]] && rm -r "$dir"
mkdir "$dir"
cp -pr "$odir"/* "$dir"
cp -pr "$(dirname "$0")/../build/"* "$dir"
$(loop "$dir")
