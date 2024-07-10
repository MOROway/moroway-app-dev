#!/bin/bash

# Executed by https://github.com/MOROway/moroway-app-dev/blob/main/build/build.sh
# -b beta number (0=off, 1,2,3,etc=beta number)
# -d debug (0=off, 1=on)
# -l server link
# -o path to build tools output directory (e.g. /path/to/moroway-app-dev/out/android/latest/)
# -s share link
# -v version
# -w path to build tools working directory (e.g. /path/to/moroway-app-dev/build)

while getopts :b:d:l:o:s:v:w: opts; do
	case $opts in
	o) output_dir_build=$OPTARG ;;
	v) version=$OPTARG ;;
	w) working_dir_build=$OPTARG ;;
	esac
done

[[ ! -d "$working_dir_build/changelogs" ]] && exit 1
[[ ! -d "$working_dir_build/strings" ]] && exit 2
[[ ! -d "$output_dir_build" ]] && exit 3
[[ "$(uname -m)" == x86_64 ]] || exit 4
cd $(dirname "$0") || exit 5

# Copy MOROway App Files
rm -r app/src/main/assets/animation
cp -r "$output_dir_build" app/src/main/assets/animation

# Set Build Config
version_long=$(echo "$version" | sed 's/\.\([0-9]\)/.0\1/g' | sed 's/\.0\([0-9]\{2\}\)/\1/g' | sed 's/\.//g')"0"
old_version_long=$(grep versionCode app/build.gradle | sed 's/^.*versionCode\s\([0-9]\+\).*$/\1/')
(($old_version_long >= $version_long)) && version_long=$(($old_version_long + 1))
sed -i "s/\(versionCode\s\)[0-9]\+/\1$version_long/" app/build.gradle
sed -i "s/\(versionName\s'\)[^']\+/\1$version/" app/build.gradle

# Set Changelog
for lang in "$working_dir_build"/changelogs/*; do
	lang=$(basename "$lang")
	changelog=""
	if [[ -f "$working_dir_build/changelogs/$lang/$version" ]] || [[ -f "$working_dir_build/changelogs/default/$version" ]]; then
		changelogfile="$working_dir_build/changelogs/default/$version"
		if [[ -f "$working_dir_build/changelogs/$lang/$version" ]]; then
			changelogfile="$working_dir_build/changelogs/$lang/$version"
		fi
		changelog="$changelog"$(cat "$changelogfile" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
	fi
	if [[ -f "$working_dir_build/changelogs/$lang/$version-android" ]] || [[ -f "$working_dir_build/changelogs/default/$version-android" ]]; then
		changelogfile_platform="$working_dir_build/changelogs/default/$version-android"
		if [[ -f "$working_dir_build/changelogs/$lang/$version-android" ]]; then
			changelogfile_platform="$working_dir_build/changelogs/$lang/$version-android"
		fi
		changelog="$changelog"$(cat "$changelogfile_platform" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
	fi
	if [[ $(cat "$working_dir_build/changelogs/meta/fixes/bool/$version") == 1 ]]; then
		changelogfile_bool="$working_dir_build/changelogs/meta/fixes/locale/default"
		if [[ -f "$working_dir_build/changelogs/meta/fixes/locale/$lang" ]]; then
			changelogfile_bool="$working_dir_build/changelogs/meta/fixes/locale/$lang"
		fi
		changelog="$changelog"$(cat "$changelogfile_bool")"."$'\n'
	fi
	if [[ $lang == default ]]; then
		lang=""
	else
		lang="-$lang"
	fi
	if [[ -d app/src/main/res/values"$lang"/ ]]; then
		echo '<?xml version="1.0" encoding="utf-8"?><resources><string name="d_update_changelog">'$(echo "$changelog" | perl -0pe 's/\n$//g' | perl -0pe 's/\n/\\n/g' | sed 's/&/\&amp;/g' | sed 's/>/\&gt;/g' | sed 's/</\&lt;/g' | sed "s/'/\\\\'/g" | sed 's/"/\&quot;/g')'</string></resources>' >app/src/main/res/values"$lang"/changelog-strings.xml
	fi
done

# Set Strings
for string_file in "$working_dir_build"/strings/*; do
	lang="$(echo "$(basename "$string_file")" | sed 's/[.]json$//;s/strings//;s/_/-r/;s/-en//')"
	out=./app/src/main/res/values"$lang"/"auto-strings.xml"
	./build-libs/jq-linux-amd64 'with_entries(select((.key | startswith("general")) or (.key | startswith("platformAndroid")))) | to_entries | map({"+@name": .key, "+content": .value}) | {"+p_xml": "version=\"1.0\" encoding=\"utf-8\"", "resources": {"string":[.]}} ' "$string_file" | ./build-libs/yq_linux_amd64 \
		--xml-content-name "+content" \
		--xml-proc-inst-prefix "+p_" \
		--xml-attribute-prefix "+@" \
		--input-format json \
		--output-format xml | sed "s/&#39;/\\\\'/g" >"$out"
done
