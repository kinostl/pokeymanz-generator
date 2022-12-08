#!/bin/bash
ASSET_FOLDER = "../src/assets"
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 48x48 $ASSET_FOLDER/favicon.ico
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 192x192 $ASSET_FOLDER/icons/android-chrome-192x192.png 
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 512x512 $ASSET_FOLDER/icons/android-chrome-512x512.png 
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 180x180 $ASSET_FOLDER/icons/apple-touch-icon.png 
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 16x16 $ASSET_FOLDER/icons/favicon-16x16.png 
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 32x32 $ASSET_FOLDER/icons/favicon-32x32.png 
convert -background none -trim $ASSET_FOLDER/pokeball.svg -resize 150x150 $ASSET_FOLDER/icons/mstile-150x150.png 

