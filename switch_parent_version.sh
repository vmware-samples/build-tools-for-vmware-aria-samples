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

ALL_COE_NPM_PACKS=(polyglotpkg vropkg)
for NPM_PACK in "${ALL_COE_NPM_PACKS[@]}"; do
	find . -name "package.json" -exec sed -i "s/\"@vmware-pscoe\/$NPM_PACK\":[^,]*/\"@vmware-pscoe\/$NPM_PACK\": \"https:\/\/repo1.maven.org\/maven2\/com\/vmware\/pscoe\/iac\/$NPM_PACK\/$TARGET_VERSION\/$NPM_PACK-$TARGET_VERSION.tgz\"/g" {} +
done
