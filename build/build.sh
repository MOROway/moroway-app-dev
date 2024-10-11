#!/bin/bash

function log() {
	echo "$1"
	[[ "$2" == 0 ]] && printf '%s\n' "$1 $(date -R)" >>../out/build_logs || printf '\t%s\n' "$1 $(date -R)" >>../out/build_logs
}

function logexit() {
	log "build failed $1 $2" 0
	exit $1
}

function loop_files() {
	LC_COLLATE=C
	files=("$1"/*)
	for file in "${files[@]}"; do
		if [[ -f "$file" ]]; then
			echo $(echo "$file" | sed "s#$2/##")
		elif [[ -d "$file" ]]; then
			echo $(loop_files "$file" "$2")
		fi
	done
}

function get_conf() {
	conf=$(cat ./conf)
	if [[ -f ./conf_local ]]; then
		conf=$(cat ./conf ./conf_local)
	fi
	pattern="^$1="
	if [[ "$2" == 1 ]] && [[ ! -z $(echo "$conf" | grep -e "^debug:$platform:$1=\|^$platform:debug:$1=") ]]; then
		pattern="^debug:$platform:$1=\|^$platform:debug:$1="
	elif [[ "$2" == 1 ]] && [[ ! -z $(echo "$conf" | grep -e "^debug:$1=") ]]; then
		pattern="^debug:$1="
	elif [[ ! -z $(echo "$conf" | grep -e "^$platform:$1=") ]]; then
		pattern="^$platform:$1="
	fi
	echo $(echo "$conf" | grep -e "$pattern" | tail -1 | sed s/[^=]*=//)
}

dir=$(dirname "$0")
cd "$dir" || logexit 3 "Could not set working directory"
[[ "$(uname -m)" == x86_64 ]] || logexit 13 "Machine architecture not supported."

[[ ! -d ../out ]] && mkdir ../out

tsc -v >/dev/null 2>&1 || logexit 5 "typescript not installed"
fonttools -h >/dev/null 2>&1 || logexit 11 "fonttools not installed"

platforms=$(ls "../app_platforms")
while getopts :d:p: opts; do
	case $opts in
	d) d=$OPTARG ;;
	p) p=$OPTARG ;;
	esac
done
debug=0
if [[ "$d" == 1 ]]; then
	debug=1
fi

log "build started" 0
valid_platform=0

[[ -f private_autotasks/prebuild.sh ]] && ./private_autotasks/prebuild.sh >../out/pre_build.log 2>&1

for platform in ${platforms[@]}; do
	if [[ "$p" == "$platform" ]] || [[ -z "$p" ]]; then

		# Get Configuration
		version=$(get_conf "version" "$debug" "$platform")
		[[ -z "$version" ]] && logexit 1 "version empty"
		version_major=$(echo "$version" | sed 's/^\([0-9]\+\)\.[0-9]\+\.[0-9]\+$/\1/')
		version_minor=$(echo "$version" | sed 's/^[0-9]\+\.\([0-9]\+\)\.[0-9]\+$/\1/')
		version_patch=$(echo "$version" | sed 's/^[0-9]\+\.[0-9]\+\.\([0-9]\+\)$/\1/')
		[[ "$version_major" != $(echo "$version_major" | sed 's/[^0-9]//g') || "$version_minor" != $(echo "$version_minor" | sed 's/[^0-9]//g') || "$version_patch" != $(echo "$version_patch" | sed 's/[^0-9]//g') ]] && logexit 1 "version invalid"
		date '+%Y' >changelogs/meta/year/"$version"
		[[ ! -f changelogs/meta/fixes/"$version" ]] && echo 0 >changelogs/meta/fixes/"$version"
		beta=$(echo "$(get_conf "beta" "$debug" "$platform")" | sed s/[^0-9]//g)
		[[ -z "$beta" ]] && logexit 2 "beta empty"
		beta_identifier=""
		if (($beta > 0)); then
			beta_identifier="-beta-$beta"
		fi
		sharelink=$(echo "$(get_conf "sharelink" "$debug" "$platform")" | sed 's/!/\\!/g' | sed 's/&/\\&/g' | sed 's/"/%22/g')
		serverlink=$(echo "$(get_conf "serverlink" "$debug" "$platform")" | sed 's/!/\\!/g' | sed 's/&/\\&/g' | sed 's/"/%22/g')
		app_link_self=$(echo "$(get_conf "app_self_link" "$debug" "$platform")" | sed 's!/!\\/!g' | sed 's/&/\\&/g' | sed 's/"/%22/g')
		app_link_banner=$(echo "$(get_conf "app_banner_link" "$debug" "$platform")" | sed 's!/!\\/!g' | sed 's/&/\\&/g' | sed 's/"/%22/g')
		convert_audio=$(echo "$(get_conf "convert_audio" "$debug" "$platform")" | sed 's/[^a-zA-Z0-9]//g')
		if [[ -z "$convert_audio" ]] || [[ "$convert_audio" == "ogg" ]] || [[ "$convert_audio" == "0" ]]; then
			sound_file_extension="ogg"
		else
			ffmpeg -h >/dev/null 2>&1 || logexit 9 "FFmpeg not installed, but audio conversion enabled by configuration"
			sound_file_extension="$convert_audio"
		fi

		# Start build for platform
		valid_platform=1
		log "platform/version $platform/$version.$beta"

		# Prepare copy files
		from=../app
		fromPf=../app_platforms/"$platform"
		to=../out/"$platform"/"$version$beta_identifier"
		[[ ! -d ../out/"$platform"/ ]] && mkdir ../out/"$platform"/
		[[ -d "$to" ]] && rm -r "$to"
		mkdir "$to"

		# Copy core and platform files
		cp -pr "$from/"* "$to"
		cp -pr "$fromPf/"* "$to"
		cp -pr ../ABOUT "$to"
		cp -pr ../LICENSE* "$to"

		# Remove core excludes
		file="$to/core_excludes"
		if [[ -f "$file" ]]; then
			while read -r line; do
				if [[ ! "$line" =~ ^"#" ]]; then
					line=$(echo "$line" | sed 's/\(^\|[^\\]\)\s\+/\1/g;s/\(^\|[/]\)\+[.][.]\+//g;s!^[/]\+!!g')
					[[ ! -z "$line" ]] && rm -r "$to/"$line
				fi
			done <"$file"
			rm "$file"
		fi

		# Modify Content
		all_files=$(loop_files "$to" "$to")
		# App Data
		file="$to/src/jsm/common/app_data.ts"
		debugBool=false
		if [[ "$debug" == 1 ]]; then
			debugBool=true
		fi
		sed -i "s/\"{{version_major}}\"/$version_major/;s/\"{{version_minor}}\"/$version_minor/;s/\"{{version_patch}}\"/$version_patch/;s/\"{{date_year}}\"/"$(date "+%Y")"/;s/\"{{date_month}}\"/"$(date "+%-m")"/;s/\"{{date_day}}\"/"$(date "+%-d")"/;s/{{platform}}/$platform/;s/\"{{beta}}\"/$beta/;s/\"{{debug}}\"/$debugBool/" "$file"
		# Strings
		file="$to/src/jsm/common/string_tools.ts"
		strings="{"
		for clang in strings/strings-*.json; do
			langCode=$(echo "$clang" | sed 's/[^-]*-\([^.]*\).*/\1/')
			stringsCurrent=$(cat "$clang" | sed 's/\\/\\\\/g' | sed 's!/!\\/!g' | perl -0pe 's/(\n|\s|\t)*([^\n]*)\n/\2/g' | perl -0pe 's/\n*}$/,/g')
			strings="$strings$langCode:$stringsCurrent{{changelog=$langCode}}},"
		done
		strings=$(echo "$strings" | perl -0pe 's/,$/}/g')
		perl -0pi -e "s/\"\{\{strings\}\}\"/$strings/" "$file"
		[[ $(file -i "$file" | sed 's/.*charset=//') != utf-8 ]] && logexit 4 "setting strings internal error"
		for clangdir in changelogs/*; do
			clang=$(basename "$clangdir")
			if [[ "$clang" != meta ]] && [[ ! -z $(grep "{{changelog=$clang}}" "$file") ]] && [[ -f "changelogs/$clang/changelog.yml" ]]; then
				changelogs=""
				for cv in $(./build-libs/yq_linux_amd64 '.versions | select(.) | keys[] | select(. == "*.0")' "changelogs/$clang/changelog.yml"); do
					cvMa=$(echo "$cv" | sed 's/^\([0-9]\+\)\.[0-9]\+\.0$/\1/')
					cvMi=$(echo "$cv" | sed 's/^[0-9]\+\.\([0-9]\+\)\.0$/\1/')
					changelog="whatsNewScreenByVersionMa${cvMa}Mi${cvMi}: ["
					changelogfile_year="changelogs/meta/year/$cv"
					if [[ -f "$changelogfile_year" ]]; then
						changelog="$changelog"'"'$(cat "$changelogfile_year")'",'
					fi
					changelogAdd=""
					while read -r line; do
						if [ ! -z "$line" ]; then
							line=$(echo "$line" | sed 's/"/\\"/g')
							changelogAdd="$changelogAdd"$(printf '"%s",' "$line")
						fi
					done < <(./build-libs/yq_linux_amd64 e ".versions .\"$cv\" .general | select(.)" "changelogs/$clang/changelog.yml")
					if [[ -z "$changelogAdd" ]]; then
						while read -r line; do
							if [ ! -z "$line" ]; then
								line=$(echo "$line" | sed 's/"/\\"/g')
								changelogAdd="$changelogAdd"$(printf '"%s",' "$line")
							fi
						done < <(./build-libs/yq_linux_amd64 e ".versions .\"$cv\" .general | select(.)" "changelogs/default/changelog.yml")
					fi
					changelog="$changelog$changelogAdd"
					changelogAdd=""
					while read -r line; do
						if [ ! -z "$line" ]; then
							line=$(echo "$line" | sed 's/"/\\"/g')
							changelogAdd="$changelogAdd"$(printf '"%s",' "$line")
						fi
					done < <(./build-libs/yq_linux_amd64 e ".versions .\"$cv\" .\"$platform\" | select(.)" "changelogs/$clang/changelog.yml")
					if [[ -z "$changelogAdd" ]]; then
						while read -r line; do
							if [ ! -z "$line" ]; then
								line=$(echo "$line" | sed 's/"/\\"/g')
								changelogAdd="$changelogAdd"$(printf '"%s",' "$line")
							fi
						done < <(./build-libs/yq_linux_amd64 e ".versions .\"$cv\" .\"$platform\" | select(.)" "changelogs/default/changelog.yml")
					fi
					changelog="$changelog$changelogAdd"
					if [[ $(cat "changelogs/meta/fixes/$cv") == 1 ]]; then
						line=$(echo "$(./build-libs/yq_linux_amd64 e ".fixes | select(.)" changelogs/$clang/changelog.yml)" | sed 's/"/\\"/g')
						if [[ -z "$line" ]]; then
							line=$(echo "$(./build-libs/yq_linux_amd64 e ".fixes | select(.)" changelogs/default/changelog.yml)" | sed 's/"/\\"/g')
						fi
						changelog="$changelog$(printf '"%s",' "$line.")"
					fi
					changelogs="$changelogs"$(echo "$changelog" | sed 's/,$/],/')
				done
				changelogs=$(echo "$changelogs" | sed 's/\\/\\\\/g' | sed 's/&/\\&/g' | sed 's#/#\\/#g' | perl -0pe 's/,$//g')
				sed -i "s/{{changelog=$clang}}/$changelogs/" "$file"
			fi
		done
		sed -i "s/{{changelog=[^}]*}}//g" "$file"
		# Web Tools
		file="$to/src/jsm/common/web_tools.ts"
		hypertextprotocol=https
		if [[ "$debug" == 1 ]]; then
			hypertextprotocol=http
		fi
		websocketprotocol=wss
		if [[ "$debug" == 1 ]]; then
			websocketprotocol=ws
		fi
		shareserver=$(echo "$sharelink" | sed "s!.*:/\{2\}\([^/]*\).*!\1!")
		sed -i "s!{{sharelink}}!$sharelink!;s!{{shareserver}}!$shareserver!;s!{{serverlink}}!$serverlink!;s/{{hypertextprotocol}}/$hypertextprotocol/;s/{{websocketprotocol}}/$websocketprotocol/" "$file"
		# Game Screen
		file="$to/src/jsm/scripting.ts"
		sed -i "s/{{sound_file_extension}}/$sound_file_extension/" "$file"
		# JS License Header
		for js_file in ${all_files[@]}; do
			if [[ "$js_file" =~ .([t]|[j])s$ ]] && [[ ! "$js_file" =~ ^src/lib ]]; then
				license_header=("\\ */" "\\ * SPDX-License-Identifier: $(sed 's!/!!g' <"metadata/default/license.txt")" "\\ * Copyright $(date "+%Y") $(sed 's!/!!g' <"metadata/default/author.txt")" "/**")
				for line in "${license_header[@]}"; do
					sed -i "1i$line" "$to/$js_file"
				done
			fi
		done
		# TS Content
		cp tsconfig.json "$to/tsconfig.json"
		for ts_file in ${all_files[@]}; do
			if [[ "$ts_file" =~ .ts$ ]]; then
				replace="../jsm_platform"
				i=0
				while [[ ! -d "$(dirname "$to/$ts_file")/$replace" ]]; do
					replace="../$replace"
					i=$(($i + 1))
					((i == 3)) && logexit 6 "module resolution error"
				done
				sed -i 's#\(import\s\+.\+\s\+from\s\+"\)[{][{]jsm_platform[}][}]#\1'"$replace"'#' "$to/$ts_file"
				replace="../jsm"
				i=0
				while [[ ! -d "$(dirname "$to/$ts_file")/$replace" ]]; do
					replace="../$replace"
					i=$(($i + 1))
					((i == 3)) && logexit 7 "module resolution error"
				done
				sed -i 's#\(import\s\+.\+\s\+from\s\+"\)[{][{]jsm[}][}]#\1'"$replace"'#' "$to/$ts_file"
			fi
		done
		tsc -p "$to/tsconfig.json" || logexit 8 "TypeScript error"
		for ts_file in ${all_files[@]}; do
			if [[ "$ts_file" =~ .ts$ ]]; then
				rm "$to/$ts_file"
			fi
		done
		rm "$to/tsconfig.json"
		# Three.js imports
		file="$to/src/lib/open_code/jsm/three.js/BufferGeometryUtils.js"
		perl -0pi -e 's/(import\s*[{][^}]+[}]\s*from\s*).three.;/\1".\/three.module.min.js"; \/\/Import statement modified by MOROway build script/' "$file"
		file="$to/src/lib/open_code/jsm/three.js/GLTFLoader.js"
		perl -0pi -e 's/(import\s*[{][^}]+[}]\s*from\s*).three.;/\1".\/three.module.min.js"; \/\/Import statement modified by MOROway build script/' "$file"
		perl -0pi -e 's/(import\s*[{][^}]+[}]\s*from\s*).\.\.\/utils\/BufferGeometryUtils.js.;/\1".\/BufferGeometryUtils.js"; \/\/Import statement modified by MOROway build script/' "$file"
		# HTML Content
		for html_file in ${all_files[@]}; do
			if [[ "$html_file" =~ .html$ ]]; then
				if [[ -f "$to/manifest.webmanifest" ]]; then
					sed -i 's/<\!--\sinsert_link_webmanifest\s-->/<link rel="manifest" href="manifest.webmanifest">/' "$to/$html_file"
				else
					sed -i 's/<\!--\sinsert_link_webmanifest\s-->//' "$to/$html_file"
					perl -pi -e "s/^\s+\n\$//" "$to/$html_file"
				fi
				meta_app_name=$(cat "metadata/default/application-name.txt" | sed 's!/!\\/!g' | sed -e 's/"/\&quot;/g' | sed 's/&/\\&/g')
				meta_author=$(cat "metadata/default/author.txt" | sed 's!/!\\/!g' | sed -e 's/"/\&quot;/g' | sed 's/&/\\&/g')
				meta_description=$(./build-libs/yq_linux_amd64 e ".Description | .Standard" metadata/default/translations.yml | sed 's!/!\\/!g' | sed -e 's/"/\&quot;/g' | sed 's/&/\\&/g')
				sed -i 's/<\!--\sinsert_title_app_name\s-->/'"$meta_app_name"'/;s/<\!--\sinsert_meta_app_name\s-->/<meta name="application-name" content="'"$meta_app_name"'">/;s/<\!--\sinsert_meta_author\s-->/<meta name="author" content="'"$meta_author"'">/;s/<\!--\sinsert_meta_description\s-->/<meta name="description" content="'"$meta_description"'">/' "$to/$html_file"
				while [[ ! -z $(grep "<\!-- dep_check -->" "$to/$html_file" | head -1) ]]; do
					if [[ -f "$to/"$(grep -A1 "<\!-- dep_check -->" "$to/$html_file" | head -2 | tail -1 | sed 's/.*\(src\|href\)="\([^"]\+\)".*/\2/') ]]; then
						perl -0pi -e "s/(^|[\n]).*<\!--\sdep_check\s-->.*\n/\n/" "$to/$html_file"
					else
						perl -0pi -e "s/(^|[\n]).*<\!--\sdep_check\s-->.*\n.*\n/\n/" "$to/$html_file"
					fi
				done
				if [[ ! -z "$app_link_self" ]] && [[ ! -z "$app_link_banner" ]]; then
					sed -i 's/<\!--\sinsert_open_graph_data\s-->/<meta property="og:title" content="'"$meta_app_name"'"><meta property="og:type" content="website"><meta property="og:url" content="'"$app_link_self"'"><meta property="og:image" content="'"$app_link_banner"'">/' "$to/$html_file"
				else
					sed -i 's/<\!--\sinsert_open_graph_data\s-->//' "$to/$html_file"
					perl -pi -e "s/^\s+\n\$//" "$to/$html_file"
				fi
			fi
		done

		# Media: Convert OGG audios
		if [[ "$sound_file_extension" != "ogg" ]]; then
			for ogg_file in ${all_files[@]}; do
				if [[ "$ogg_file" =~ .ogg$ ]]; then
					ffmpeg -i "$to/$ogg_file" -vn -fflags +bitexact "$(echo "$to/$ogg_file" | sed 's/.ogg$/.'"$sound_file_extension"'/')" >/dev/null 2>&1 || logexit 10 "FFmpeg error"
					rm "$to/$ogg_file"
				fi
			done
		fi

		# Generate fonts
		fontBasePath="$to/src/lib/open_fonts"
		fontPath="$fontBasePath/google/MaterialSymbols"
		fontFile="$fontPath/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].ttf"
		fonttools varLib.mutator "$fontFile" FILL=1 GRAD=125 opsz=48 wght=450 --no-recalc-timestamp -o "$fontPath/MaterialSymbols.ttf" >/dev/null 2>&1 || logexit 12 "fonttools error"
		rm "$fontFile"
		fontPath="$fontBasePath/google/Roboto"
		fontFile="$fontPath/Roboto[wdth,wght].ttf"
		fonttools varLib.mutator "$fontFile" wdth=480 wght=500 --no-recalc-timestamp -o "$fontPath/Roboto-Medium.ttf" >/dev/null 2>&1 || logexit 12 "fonttools error"
		fonttools varLib.mutator "$fontFile" wdth=480 wght=400 --no-recalc-timestamp -o "$fontPath/Roboto-Regular.ttf" >/dev/null 2>&1 || logexit 12 "fonttools error"
		rm "$fontFile"

		# Web Manifest
		file="$to/manifest.webmanifest"
		if [[ -f "$file" ]]; then
			meta_app_name=$(cat "metadata/default/application-name.txt" | sed 's!/!\\/!g' | sed 's/&/\\&/g' | sed -e 's/"/\\\\"/g')
			meta_app_name_short=$(cat "metadata/default/application-name-short.txt" | sed 's!/!\\/!g' | sed 's/&/\\&/g' | sed -e 's/"/\\\\"/g')
			meta_description=$(./build-libs/yq_linux_amd64 e ".Description | .Standard" metadata/default/translations.yml | sed 's!/!\\/!g' | sed 's/&/\\&/g' | sed -e 's/"/\\\\"/g')
			sed -i "s/{{name}}/$meta_app_name/;s/{{short_name}}/$meta_app_name_short/;s/{{description}}/$meta_description/" "$file"
		fi
		# Service Worker
		file="$to/sw.js"
		if [[ -f "$file" ]]; then
			all_files=$(loop_files "$to" "$to")
			file_ex="$to/sw_excludes"
			sw_files_text=""
			for sw_file in ${all_files[@]}; do
				use=1
				if [[ -f "$file_ex" ]]; then
					while read -r line; do
						if [[ "$sw_file" =~ $line ]]; then
							use=0
						fi
					done <"$file_ex"
				fi
				if [[ $use == 1 ]] && [[ "$to/$sw_file" != "$file_ex" ]]; then
					sw_files_text="$sw_files_text'$sw_file',"
				fi
			done
			sw_files_text=$(echo "$sw_files_text" | sed 's/,$//' | sed "s/'index\.html'/'.'/g" | sed 's/index\.html//g')
			if [[ -f "$file_ex" ]]; then
				rm "$file_ex"
			fi
			sed -i "s/{{sw_platform}}/$platform/;s/{{sw_version}}/$version/;s/{{sw_beta}}/$beta_identifier/;s#\"{{sw_files}}\"#$sw_files_text#" "$file"
		fi

		# Add read me
		printf '%s\n\n' "# MOROway App" "The MOROway App is a virtual model railroad." "LICENSES ARE EXPLAINED IN THE '[ABOUT](./ABOUT)' FILE." "This is a ready-to-use MOROway App version generated by MOROway App [build tools](https://github.com/MOROway/moroway-app-dev)." >"$to"/README.md

		# Link current version
		if [[ $beta == 0 ]]; then
			[[ -L ../out/"$platform"/current ]] && rm ../out/"$platform"/current
			ln -s "$version$beta_identifier" ../out/"$platform"/current
		fi
		[[ -L ../out/"$platform"/latest ]] && rm ../out/"$platform"/latest
		ln -s "$version$beta_identifier" ../out/"$platform"/latest

		# Platform specific build scripts
		if [[ -f ../wrapper/"$platform"/build.sh ]]; then
			log "start platform-wrapper build"
			$(../wrapper/"$platform"/build.sh -b "$beta" -d "$debug" -l "$serverlink" -o "$(realpath ../out/"$platform"/latest/)" -s "$sharelink" -v "$version" -w "$(realpath .)" >/dev/null 2>&1) || logexit $((1000 + $?)) "platform-wrapper build"
			log "finished platform-wrapper build"
		fi

	fi
done

[[ -f private_autotasks/postbuild.sh ]] && ./private_autotasks/postbuild.sh >../out/post_build.log 2>&1

[[ $valid_platform == 1 ]] && log "build succeeded" 0 || logexit 100 "invalid platform"
