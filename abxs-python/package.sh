#!/bin/bash
path=$(dirname $0)/

if ! command -v zip &> /dev/null
then
  echo 'Cannot find any applicable command for zipping files. Please install `zip` command'
  exit
fi

if ! command -v unzip &> /dev/null
then
  echo 'Cannot find any applicable command for unzipping files. Please install `unzip` command'
  exit
fi

if [[ ! -d "${path}form" ]]; then
	echo 'Cannot find directory form/'
  exit
fi

if [[ ! -d "${path}target" ]] || ! ls ${path}target/*.abx &> /dev/null; then
	echo 'There is either no `target` directory or cannot find abx file in it'
  exit
fi

if ls ${path}form/*.yaml &> /dev/null; then
  # abx flow
	abx_file=$(ls ${path}target/*.abx)
	abx_bn=$(basename ${abx_file%.*})
	
	zip -jq ${path}target/$abx_bn.zip ${path}form/*
else
  # abx action
  abx_file=$(ls ${path}target/*.abx)
  abx_bn="$(basename $path$abx_file .abx)"
  
  # zip files in proper directory with proper name
  mkdir -p .tmp
  
  cp ${path}form/* .tmp/$abx_bn.abx
  unzip -qp ${path}target/$abx_bn.abx bundle.zip > .tmp/$abx_bn.zip
  zip -jq ${path}target/$abx_bn.zip .tmp/*
  
  rm -rf .tmp
fi
