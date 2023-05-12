#!/bin/bash

TARGET_VERSION=$1

if [ "$TARGET_VERSION" == "" ]; then
	echo "Target version is not specified!"
	exit 100
fi

mvn versions:update-parent -DparentVersion=$TARGET_VERSION -DskipResolution=true -DgenerateBackupPoms=false -U --batch-mode

ALL_PLUGINS=(abx-package-maven-plugin o11n-actions-package-maven-plugin o11n-polyglot-package-maven-plugin vrealize-package-maven-plugin)
for PLUGIN in "${ALL_PLUGINS[@]}"; do
	find . -name "pom.xml" -exec sed -i ":begin;$!N;s/<artifactId>$PLUGIN<\/artifactId>\n\(	*\)<version>\([a-zA-Z0-9_.]*\)<\/version>/<artifactId>$PLUGIN<\/artifactId>\n				<version>$TARGET_VERSION<\/version>/g;tbegin;P;D" {} +
done
