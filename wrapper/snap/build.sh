#!/bin/bash

# Executed by https://github.com/MOROway/moroway-app-dev/blob/main/build/build.sh
# -b beta number (0=off, 1,2,3,etc=beta number)
# -d debug (0=off, 1=on)
# -l server link
# -o path to build tools output directory (e.g. /path/to/moroway-app-dev/out/oc/latest/)
# -s share link
# -v version
# -w path to build tools working directory (e.g. /path/to/moroway-app-dev/build)

while getopts :b:d:l:o:s:v:w: opts; do
   case $opts in
   b) beta=$OPTARG ;;
   l) link=$OPTARG ;;
   o) output_dir_build=$OPTARG ;;
   v) version=$OPTARG ;;
   w) working_dir_build=$OPTARG ;;
   esac
done

[[ ! -d "$working_dir_build/changelogs" ]] && exit 1
[[ ! -d "$output_dir_build" ]] && exit 2
cd $(dirname "$0") || exit 3

# Copy MOROway App Files
rm -r moroway-snapp
cp -r "$output_dir_build" moroway-snapp

# Set Changelog
if [[ $beta == 0 ]]; then
   changelog_file="CHANGELOG.txt"
   [[ -z $(cat "$changelog_file") ]] && echo "CHANGELOG" >"$changelog_file"
   changelog=""
   if [[ -f "$working_dir_build/changelogs/default/$version" ]]; then
      changelog="$changelog"$(cat "$working_dir_build/changelogs/default/$version" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
   fi
   if [[ -f "$working_dir_build/changelogs/default/$version-snap" ]]; then
      changelog="$changelog"$(cat "$working_dir_build/changelogs/default/$version-snap" | sed 's/{{[0-9]\+}}\s\?//g')$'\n'
   fi
   if [[ $(cat "$working_dir_build/changelogs/meta/fixes/bool/$version") == 1 ]]; then
      changelog="$changelog"$(cat "$working_dir_build/changelogs/meta/fixes/locale/default")"."$'\n'
   fi
   if [[ ! -z "$changelog" ]] && [[ -z $(cat "$changelog_file" | grep "$version") ]]; then
      printf '%s' $'\n'$'\n'"$version"$'\n'$'\n'"$changelog"$'\n'$'\n'"---"$'\n'$'\n' >>"$changelog_file"
   fi
fi

# Set App Domain
echo $(echo "$link" | sed 's!^\(.*//\)*\([^/]*\).*$!\2!') >app_domain.txt

# Set App Version
content=$(cat config.xml | sed "s/version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version=\"$version\"/")
echo "$content" >config.xml
