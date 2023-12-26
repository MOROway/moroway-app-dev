#!/bin/bash

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

rm -r app/src/main/assets/animation
cp -r "$output_dir_build" app/src/main/assets/animation
version_long=$(echo "$version" | sed 's/\.\([0-9]\)/.0\1/g' | sed 's/\.0\([0-9]\{2\}\)/\1/g' | sed 's/\.//g')"0"
old_version_long=$(grep versionCode app/build.gradle | sed 's/^.*versionCode\s\([0-9]\+\).*$/\1/')
(($old_version_long >= $version_long)) && version_long=$(($old_version_long + 1))
sed -i "s/\(versionCode\s\)[0-9]\+/\1$version_long/" app/build.gradle
sed -i "s/\(versionName\s'\)[^']\+/\1$version/" app/build.gradle
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
	if [[ -f app/src/main/res/values"$lang"/strings.xml ]]; then
		sed -i "/<string name=\"d_update_changelog\">.*<\/string>/d" app/src/main/res/values"$lang"/strings.xml
	fi
	if [[ ! -z "$changelog" ]] && [[ -d app/src/main/res/values"$lang"/ ]]; then
		echo '<?xml version="1.0" encoding="utf-8"?><resources><string name="d_update_changelog">'$(echo "$changelog" | perl -0pe 's/\n$//g' | perl -0pe 's/\n/\\n/g' | sed 's/&/\&amp;/g' | sed 's/>/\&gt;/g' | sed 's/</\&lt;/g' | sed 's/'"'"'/\&apos;/g' | sed 's/"/\&quot;/g')'</string></resources>' >app/src/main/res/values"$lang"/changelog-strings.xml
	elif [[ -f app/src/main/res/values"$lang"/changelog-strings.xml ]]; then
		rm app/src/main/res/values"$lang"/changelog-strings.xml
	fi
done
for string_file in "$working_dir_build"/strings/*; do
	lang="$(echo "$(basename "$string_file")" | sed 's/[.]json$//;s/strings//;s/_/-r/;s/-en//')"
	out=./app/src/main/res/values"$lang"/"auto-strings.xml"
	./build-libs/jq-linux-amd64 'with_entries(select((.key | startswith("general")) or (.key | startswith("platformAndroid")))) | to_entries | map({"+@name": .key, "+content": .value}) | {"+p_xml": "version=\"1.0\" encoding=\"utf-8\"", "resources": {"string":[.]}} ' "$string_file" | ./build-libs/yq_linux_amd64 \
		--xml-content-name "+content" \
		--xml-proc-inst-prefix "+p_" \
		--xml-attribute-prefix "+@" \
		--input-format json \
		--output-format xml >"$out"
done
if [[ $version =~ .0$ ]]; then
	isMajor=true
else
	isMajor=false
fi
sed -i "s/\(\sSHOW_UPDATE_NOTE\s\?=\).\+/\1 $isMajor/" app/src/main/java/appinventor/ai_Jonathan_Herrmann_Engel/MOROway/Globals.kt
sed -i "s/\(\sVERSION_NAME\s\?=\).\+/\1 \"$version\"/" app/src/main/java/appinventor/ai_Jonathan_Herrmann_Engel/MOROway/Globals.kt
