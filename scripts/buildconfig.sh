#!/usr/bin/env bash
sed -i .bak 's/content src="[^"]\{1,\}"/content src="index.html"/' ./config.xml
