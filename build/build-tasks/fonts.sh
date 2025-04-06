#!/bin/bash

# Update fonts

cd "$(dirname "$0")/../" || exit 1
cacheDir=.cache
fontsOutDir=$cacheDir/fonts
mkdir -p $cacheDir || exit 2
if [[ ! -d "$fontsOutDir" ]]; then
	mkdir "$fontsOutDir" || exit 3
fi

fontBasePath="build-libs/fonts"
fontPath="google/MaterialSymbols"
fontFile="$fontBasePath/$fontPath/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].ttf"
mkdir -p "$fontsOutDir/$fontPath/"
fontFileOut="$fontsOutDir/$fontPath/MaterialSymbols.ttf"
if [[ ! -e "$fontFileOut" ]] || [[ "$fontFileOut" -ot "$fontFile" ]]; then
	fonttools varLib.mutator "$fontFile" FILL=1 GRAD=125 opsz=48 wght=450 --no-recalc-timestamp -o "$fontFileOut" || exit 11
fi
cp -p "$fontBasePath/$fontPath/"*.{txt,css} "$fontsOutDir/$fontPath/"
fontPath="google/Roboto"
fontFile="$fontBasePath/$fontPath/Roboto[wdth,wght].ttf"
mkdir -p "$fontsOutDir/$fontPath/"
fontFileOut="$fontsOutDir/$fontPath/Roboto-Medium.ttf"
if [[ ! -e "$fontFileOut" ]] || [[ "$fontFileOut" -ot "$fontFile" ]]; then
	fonttools varLib.mutator "$fontFile" wdth=480 wght=500 --no-recalc-timestamp -o "$fontFileOut" || exit 12
fi
fontFileOut="$fontsOutDir/$fontPath/Roboto-Regular.ttf"
if [[ ! -e "$fontFileOut" ]] || [[ "$fontFileOut" -ot "$fontFile" ]]; then
	fonttools varLib.mutator "$fontFile" wdth=480 wght=400 --no-recalc-timestamp -o "$fontFileOut" || exit 13
fi
cp -p "$fontBasePath/$fontPath/"*.{txt,css} "$fontsOutDir/$fontPath/"
