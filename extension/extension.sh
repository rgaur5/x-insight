#!/usr/bin/env bash

#NOTE: if you are on macOS, update to bash v4 i.e brew install bash

rm -rf extension extension.zip
cp -r public extension 
cd extension
 
declare -A scripts0=(
    [file]='ort.min.js'
    [url]='https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js'
)

declare -n scripts
for scripts  in ${!scripts@}; do
  curl ${scripts[url]} -o ${scripts[file]}
  sed -i"" -e "s|${scripts[url]}|${scripts[file]}|g" popup.html
done

zip -r extension.zip *
mv extension.zip ../