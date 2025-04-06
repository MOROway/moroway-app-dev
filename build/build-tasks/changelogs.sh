#!/bin/bash

# Update changelogs

function changelog_add() {
	out=""
	while read -r line; do
		if [ -n "$line" ]; then
			line=$(echo "$line" | sed 's/"/\\"/g')
			out="$out"$(printf '"%s",' "$line")
		fi
	done < <(./build-libs/yq_linux_amd64 e ".\"$1\" .\"$2\" .\"$3\" | select(.)" "changelogs/$4/changelog.yml")
	echo "$out"
}

cd "$(dirname "$0")/../" || exit 1
cache_dir=.cache
changelog_dir=$cache_dir/changelogs
mkdir -p $cache_dir || exit 2
if [[ ! -d "$changelog_dir" ]]; then
	mkdir "$changelog_dir" || exit 3
fi

while getopts p: opts; do
	case $opts in
	p) platform=$OPTARG ;;
	esac
done
[[ -z "$platform" ]] && exit 4

changelogs=""
for clangdir in changelogs/*; do
	if [[ -d "$clangdir" ]]; then
		clang="$(basename "$clangdir")"
		mkdir -p "$changelog_dir/$clang"
		if [[ -d ../app_platforms/"$platform" ]]; then
			if [[ -L "$clangdir" ]]; then
				clang_alias="$clang/$platform.json"
				clang_destination="../$(basename "$(realpath "$clangdir")")/$platform.json"
				[[ -L "$changelog_dir/$clang_alias" ]] && rm "$changelog_dir/$clang_alias"
				ln -s "$clang_destination" "$changelog_dir/$clang_alias"
			else
				if [[ -f "changelogs/$clang/changelog.yml" ]]; then
					out_file="$changelog_dir/$clang/$platform.json"
					if [[ ! -e "$out_file" ]] || [[ "$out_file" -ot "changelogs/$clang/changelog.yml" ]] || [[ "$out_file" -ot "changelogs/default/changelog.yml" ]] || [[ "$out_file" -ot "changelogs/meta.yml" ]]; then
						echo "Generating $clang $platform"
						echo "{" >"$out_file"
						for cv in $(./build-libs/yq_linux_amd64 e 'select(.) | keys[]' "changelogs/meta.yml"); do
							cvMajor=$(echo "$cv" | sed 's/^\([0-9]\+\)\.[0-9]\+\.[0-9]\+$/\1/')
							cvMinor=$(echo "$cv" | sed 's/^[0-9]\+\.\([0-9]\+\)\.[0-9]\+$/\1/')
							cvPatch=$(echo "$cv" | sed 's/^[0-9]\+\.[0-9]\+\.\([[0-9]\+\)$/\1/')
							changelogVersions=""
							changelogAdd="$(changelog_add "versions" "$cv" "general" "$clang")"
							if [[ -z "$changelogAdd" ]]; then
								changelogAdd="$(changelog_add "versions" "$cv" "general" "default")"
							fi
							changelogVersions="$changelogVersions$changelogAdd"
							changelogAdd="$(changelog_add "versions" "$cv" "$platform" "$clang")"
							if [[ -z "$changelogAdd" ]]; then
								changelogAdd="$(changelog_add "versions" "$cv" "$platform" "default")"
							fi
							changelogVersions="$changelogVersions$changelogAdd"
							if [[ -n "$(./build-libs/yq_linux_amd64 e ".\"$cv\" | with_entries(select(.key == \"general\" or .key == \"$platform\")) | .[] | select(.translations == true)" changelogs/meta.yml)" ]]; then
								line=$(echo "$(./build-libs/yq_linux_amd64 e ".translations | select(.)" changelogs/$clang/changelog.yml)" | sed 's/"/\\"/g')
								if [[ -z "$line" ]]; then
									line=$(echo "$(./build-libs/yq_linux_amd64 e ".translations | select(.)" changelogs/default/changelog.yml)" | sed 's/"/\\"/g')
								fi
								changelogVersions="$changelogVersions$(printf '"%s",' "$line.")"
							fi
							if [[ -n "$(./build-libs/yq_linux_amd64 e ".\"$cv\" | with_entries(select(.key == \"general\" or .key == \"$platform\")) | .[] | select(.dependencies == true)" changelogs/meta.yml)" ]]; then
								line=$(echo "$(./build-libs/yq_linux_amd64 e ".dependencies | select(.)" changelogs/$clang/changelog.yml)" | sed 's/"/\\"/g')
								if [[ -z "$line" ]]; then
									line=$(echo "$(./build-libs/yq_linux_amd64 e ".dependencies | select(.)" changelogs/default/changelog.yml)" | sed 's/"/\\"/g')
								fi
								changelogVersions="$changelogVersions$(printf '"%s",' "$line.")"
							fi
							if [[ -n "$(./build-libs/yq_linux_amd64 e ".\"$cv\" | with_entries(select(.key == \"general\" or .key == \"$platform\")) | .[] | select(.fixes == true)" changelogs/meta.yml)" ]]; then
								line=$(echo "$(./build-libs/yq_linux_amd64 e ".fixes | select(.)" changelogs/$clang/changelog.yml)" | sed 's/"/\\"/g')
								if [[ -z "$line" ]]; then
									line=$(echo "$(./build-libs/yq_linux_amd64 e ".fixes | select(.)" changelogs/default/changelog.yml)" | sed 's/"/\\"/g')
								fi
								changelogVersions="$changelogVersions$(printf '"%s",' "$line.")"
							fi
							changelogHint=""
							changelogAdd="$(changelog_add "hints" "$cv" "general" "$clang")"
							if [[ -z "$changelogAdd" ]]; then
								changelogAdd="$(changelog_add "hints" "$cv" "general" "default")"
							fi
							changelogHint="$changelogHint$changelogAdd"
							changelogAdd="$(changelog_add "hints" "$cv" "$platform" "$clang")"
							if [[ -z "$changelogAdd" ]]; then
								changelogAdd="$(changelog_add "hints" "$cv" "$platform" "default")"
							fi
							changelogHint="$changelogHint$changelogAdd"
							changelogWarn=""
							changelogAdd="$(changelog_add "warnings" "$cv" "general" "$clang")"
							if [[ -z "$changelogAdd" ]]; then
								changelogAdd="$(changelog_add "warnings" "$cv" "general" "default")"
							fi
							changelogWarn="$changelogWarn$changelogAdd"
							changelogAdd="$(changelog_add "warnings" "$cv" "$platform" "$clang")"
							if [[ -z "$changelogAdd" ]]; then
								changelogAdd="$(changelog_add "warnings" "$cv" "$platform" "default")"
							fi
							changelogWarn="$changelogWarn$changelogAdd"
							if [[ -n "$changelogVersions" ]]; then
								changelogBegin="\"$cv\": {\"year\":$(./build-libs/yq_linux_amd64 e ".\"$cv\" .year" changelogs/meta.yml),\"content\": ["
								changelogEnd="},"
								changelog="$changelogBegin$(echo "$changelogVersions" | sed 's/,$/]/')"
								if [[ -n "$changelogHint" ]]; then
									changelog="$changelog, \"hints\": [$(echo "$changelogHint" | sed 's/,$/]/')"
								fi
								if [[ -n "$changelogWarn" ]]; then
									changelog="$changelog, \"warnings\": [$(echo "$changelogWarn" | sed 's/,$/]/')"
								fi
								echo "$changelog$changelogEnd" >>"$out_file"
							fi
						done
						sed -i '$s/,$//' "$out_file"
						echo "}" >>"$out_file"
					fi
				fi
			fi
		fi
	fi
done
