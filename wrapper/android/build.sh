#!/bin/bash

while getopts :b:d:l:o:s:v:w: opts; do
	case $opts in
	o) output_dir_build=$OPTARG ;;
	v) version=$OPTARG ;;
	w) working_dir_build=$OPTARG ;;
	esac
done

[[ ! -d "$working_dir_build/changelogs" ]] && exit 1
[[ ! -d "$output_dir_build" ]] && exit 2
cd $(dirname "$0") || exit 3

rm -r app/src/main/assets/animation
cp -r "$output_dir_build" app/src/main/assets/animation
version_long=$(echo "$version" | sed 's/\.\([0-9]\)/.0\1/g' | sed 's/\.0\([0-9]\{2\}\)/\1/g' | sed 's/\.//g')"0"
sed -i "s/\(versionCode\s\)[0-9]\+/\1$version_long/" app/build.gradle
sed -i "s/\(versionName\s'\)[^']\+/\1$version/" app/build.gradle
for lang in "$working_dir_build"/changelogs/*; do
	lang=$(basename "$lang")
	changelog=""
	if [[ -f "$working_dir_build/changelogs/$lang/$version" ]]; then
		changelog="$changelog"$(cat "$working_dir_build/changelogs/$lang/$version" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
	fi
	if [[ -f "$working_dir_build/changelogs/$lang/$version-android" ]]; then
		changelog="$changelog"$(cat "$working_dir_build/changelogs/$lang/$version-android" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
	fi
	if [[ $(cat "$working_dir_build/changelogs/meta/fixes/bool/$version") == 1 ]]; then
		changelog="$changelog"$(cat "$working_dir_build/changelogs/meta/fixes/locale/$lang")"."$'\n'
	fi
	if [[ $lang == default ]]; then
		lang=""
	else
		lang="-$lang"
	fi
	if [[ ! -z "$changelog" ]] && [[ -d app/src/main/res/values"$lang"/ ]]; then
		changelog=$(echo "$changelog" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'"'"'/\&#39;/g' | perl -0pe 's/\n$//g' | perl -0pe 's/\n/\\n/g' | sed 's/\\/\\\\/g' | sed 's/&/\\&/g' | sed 's#/#\\/#g')
		if [[ ! -z "$(grep "<string name=\"d_update_changelog\">" app/src/main/res/values"$lang"/strings.xml)" ]]; then
			sed -i "s/\(<string name=\"d_update_changelog\">\).*\(<\/string>\)/\1$changelog\2/" app/src/main/res/values"$lang"/strings.xml
		else
			sed -i "s/\(<\/resources>\)/<string name=\"d_update_changelog\">$changelog<\/string>\n\1/" app/src/main/res/values"$lang"/strings.xml
		fi
	elif [[ -d app/src/main/res/values"$lang"/ ]]; then
		sed -i "/<string name=\"d_update_changelog\">.*<\/string>/d" app/src/main/res/values"$lang"/strings.xml
	fi
done
if [[ $version =~ .0$ ]]; then
	isMajor=true
else
	isMajor=false
fi
sed -i "s/\(\sSHOW_UPDATE_NOTE\s\?=\).\+/\1 $isMajor/" app/src/main/java/appinventor/ai_Jonathan_Herrmann_Engel/MOROway/Globals.kt
sed -i "s/\(\sVERSION_NAME\s\?=\).\+/\1 \"$version\"/" app/src/main/java/appinventor/ai_Jonathan_Herrmann_Engel/MOROway/Globals.kt
