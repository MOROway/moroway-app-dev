#!/bin/bash

function log () {
	echo "$1"
	[[ "$2" == 0 ]] && printf '%s\n' "$1 $( date -R )" >> ../out/build_logs || printf '\t%s\n' "$1 $( date -R )" >> ../out/build_logs
}

function logexit () {
	log "build failed $1 $2" 0
	exit $1
}

function loop_files () {
	files=("$1"/*)
	for file in "${files[@]}"
	do
		if [[ -f "$file" ]]
		then
			echo $(echo "$file" | sed "s#$2/##")
		elif [[ -d "$file" ]]
		then
			echo $( loop_files "$file" "$2")
		fi
	done
}

dir=$( dirname "$0" )
cd "$dir"

[[ ! -d ../out ]] && mkdir ../out
log "build started" 0

conf=$(cat ./conf)

version=$( echo "$conf" | grep "version=" | sed s/.*=// );
[[ -z "$version" ]] && logexit 1 "version empty"
version_major=$(echo "$version" | sed 's/^\([0-9]\+\)\.[0-9]\+\.[0-9]\+$/\1/')
version_minor=$(echo "$version" | sed 's/^[0-9]\+\.\([0-9]\+\)\.[0-9]\+$/\1/')
version_patch=$(echo "$version" | sed 's/^[0-9]\+\.[0-9]\+\.\([0-9]\+\)$/\1/')
[[ "$version_major" != $(echo "$version_major" | sed 's/[^0-9]//g') || "$version_minor" != $(echo "$version_minor" | sed 's/[^0-9]//g') || "$version_patch" != $(echo "$version_patch" | sed 's/[^0-9]//g') ]] && logexit 1 "version invalid"

beta=$( echo "$conf" | grep "beta=" | sed s/.*=// | sed s/[^0-9]//g );
[[ -z "$beta" ]] && logexit 2 "beta empty"
beta_platform=""
if (( $beta > 0 )); then
	beta_platform="-beta-$beta"
fi
platforms=$(ls "../app_platforms")
while getopts :p: opts; do
   case $opts in
      p) p=$OPTARG;;
   esac
done
valid_platform=0
for platform in ${platforms[@]}; do
	if [[ "$p" == "$platform" ]] || [[ -z "$p" ]]; then
		valid_platform=1
		log "platform/version $platform/$version.$beta"
		from=../app
		fromPf=../app_platforms/"$platform"
		to=../out/"$platform"/"$version$beta_platform"
		[[ ! -d ../out/"$platform"/ ]] && mkdir ../out/"$platform"/
		[[ -d "$to" ]] && rm -r "$to"
		mkdir "$to"
		if [[ $beta == 0 ]]; then
			[[ -L ../out/"$platform"/current ]] && rm ../out/"$platform"/current
			ln -s "$version$beta_platform" ../out/"$platform"/current
		fi
		[[ -L ../out/"$platform"/latest ]] && rm ../out/"$platform"/latest
		ln -s "$version$beta_platform" ../out/"$platform"/latest

		# Copy Core and Platforms
		cp -pr "$from/"* "$to"
		cp -pr "$fromPf/"* "$to"
		cp -pr ../ABOUT "$to"
		cp -pr ../LICENSE* "$to"

		# Remove excludes
		file="$to/core_excludes"
		if [[ -f "$file" ]]; then
			while read -r line; do
				if [[ ! "$line" =~ ^"#" ]]; then
					line=$(echo "$line" | sed 's/^[./]\+//g')
					rm -r "$to/"$line
				fi
			done < "$file"
			rm "$file"
		fi

		# Modify Content
		file="$to/src/js/appdata.js"
		content=$(cat "$file" | sed "s/{{version_major}}/$version_major/" | sed "s/{{version_minor}}/$version_minor/" | sed "s/{{version_patch}}/$version_patch/" | sed "s/{{date_year}}/"$(date "+%Y")"/" | sed "s/{{date_month}}/"$(date "+%-m")"/" | sed "s/{{date_day}}/"$(date "+%-d")"/" | sed "s/{{platform}}/$platform/")
		printf '%s' "$content" > "$file";
		file="$to/src/js/general.js"
		content=$(cat "$file")
		while [[ ! -z $(echo "$content" | grep "{{changelog=" | head -1) ]]; do
			changelogfile="changelogs/"$(echo "$content" | grep "{{changelog=" | head -1 | sed 's/.*{{changelog=\([^/]*\)\/\([a-z]*\).*/\2/')"/"$(echo "$content" | grep "{{changelog=" | head -1 | sed 's/.*{{changelog=\([^/]*\)\/.*/\1/')
			if [[ -f "$changelogfile" ]];
			then
				changelog=""
				while read -r line; do
					changelog="$changelog"$(printf '"%s",' "$line")
				done < "$changelogfile"
				if [[ -f "$changelogfile-$platform" ]];
				then
					while read -r line; do
						changelog="$changelog"$(printf '"%s",' "$line")
					done < "$changelogfile-$platform"
				fi
				changelog=$( echo "$changelog" | sed 's/,$//')
				content=$(echo "$content" | perl -0pe "s/\{\{changelog=[^}]*\}\}/$changelog/")
			else
				content=$(echo "$content" | perl -0pe "s/\{\{changelog=[^}]*\}\}//")
			fi
			printf '%s' "$content" > "$file";
		done
		all_files=$( loop_files "$to" "$to" )
		file="$to/sw.js"
		if [[ -f "$file" ]]; then
			file_ex="$to/sw_excludes"
			sw_files_text="'.',"
			for sw_file in ${all_files[@]}; do
				use=1
				if [[ -f "$file_ex" ]]; then
					while read -r line; do
						if [[ "$sw_file" =~ $line ]]; then
							use=0
						fi
					done < "$file_ex"
				fi
				if [[ $use == 1 ]] && [[ $sw_file != "index.html" ]]; then
					sw_files_text="$sw_files_text'$sw_file',"
				fi
			done
			sw_files_text=$(echo "$sw_files_text" | sed 's/,$//' | sed 's/index\.html//g')
			if [[ -f "$file_ex" ]]; then
				rm "$file_ex"
			fi
			content=$(cat "$file" | sed "s/{{sw_platform}}/$platform/" | sed "s/{{sw_version}}/$version/" | sed "s/{{sw_beta}}/$beta_platform/" | sed "s#{{sw_files}}#$sw_files_text#")
			printf '%s' "$content" > "$file";
		fi
		for html_file in ${all_files[@]}; do
			if [[ "$html_file" =~ .html$ ]]; then
				if [[ -f "$to/manifest.webmanifest" ]]; then
					content=$(cat "$to/$html_file" | sed 's/{{webmanifest}}/<link rel="manifest" href="manifest.webmanifest">/')
				else
					content=$(cat "$to/$html_file" | sed 's/{{webmanifest}}//' | perl -pe "s/^\s+\n\$//")
				fi
				while [[ ! -z $(echo "$content" | grep "{{dep_check}}" | head -1) ]]; do
					if [[ -f "$to/"$(echo "$content" | grep "{{dep_check}}" | head -1 | sed 's/.*\(src\|href\)="\([^"]\+\)".*/\2/') ]];
					then
						content=$(echo "$content" | perl -0pe "s/\{\{dep_check\}\}//")
					else
						content=$(echo "$content" | perl -0pe "s/\n.*\{\{dep_check\}\}.*\n/\n/")
					fi
				done
				printf '%s' "$content" > "$to/$html_file"

			fi
			if [[ $use == 1 ]] && [[ $sw_file != "index.html" ]]; then
				sw_files_text="$sw_files_text'$sw_file',"
			fi
		done

		# Add read me
		printf '%s\n\n' "# MOROway App" "The MOROway App is a virtual model railroad." "LICENSES ARE EXPLAINED IN THE '[ABOUT](./ABOUT)' FILE." "This is a ready-to-use MOROway App version generated by MOROway App [build tools](https://github.com/MOROway/moroway-app-dev)." > "$to"/README.md

	fi
done

[[ $valid_platform == 1 ]] && log "build succeeded" 0 || logexit 100 "invalid platform"
