api_key=be1290e71bb2fab7a9547cda2ee37d7b
appKey=c0391f3640b56ad5038a18e1ae1ccb6a
uKey=7d42c69844b88157360fe2dc141fdf1a

OUTPUTDIR="./buildIOSTemp"
SCHEMETEST="HipRock_Test"
SCHEMEPROD="HipRock_Prod"
APP_PROJECTPATH="./ios/HipRock.xcodeproj"
PLIST_PATH='./ios/HipRock/Info.plist'

# buildNumber 放在了description，从pgy得到并加1
function buildNumberPlusOne()
{
	pgyerLog=`curl -d "_api_key=$api_key" -d "appKey=$appKey" https://www.pgyer.com/apiv2/app/view `
	currCommit=$(git rev-parse --short HEAD)
	buildNumber=$(echo $pgyerLog | tr ',' '\n' | awk -F : '/buildUpdateDescription/{print $2}'| sed 's/"//g' | head -1 | awk -F _ '{print $2}')
	buildNumber=$(($buildNumber+1))
	description="$currCommit"_"$buildNumber"
}

function version_ge() { test "$(echo "$@" | tr " " "\n" | sort -rV | head -n 1)" == "$1"; }
# 版本号 放在了version
function versionPlusOne()
{
	oldVer=`/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" ./ios/HipRock/Info.plist`
	version=$(echo $pgyerLog | tr ',' '\n' | awk -F : '/buildVersion/{print $2}' | head -1 | sed 's/"//g')
	if version_ge $version $oldVer
	then
		version=${version%.*}.$((${version##*.}+1))
	else
		version=$oldVer
	fi
	APPNAME='HipRock_V'$version
}

#打包
function package()
{
	git checkout ${PLIST_PATH}
	. ./mergeTest.sh
	rm "$OUTPUTDIR/$APPNAME/$SCHEMETEST.ipa"
	/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" ${PLIST_PATH}
	xcodebuild -project "$APP_PROJECTPATH" -scheme "$SCHEMETEST" archive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -quiet
	xcodebuild -exportArchive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -exportPath "$OUTPUTDIR/$APPNAME" -exportOptionsPlist "exportTestOptions.plist" -quiet
	curl -F "file=@$OUTPUTDIR/$APPNAME/$SCHEMETEST.ipa" -F "uKey=$uKey" -F "_api_key=$api_key" -F "installType=2" -F "password=123456" -F "updateDescription=$description" http://qiniu-storage.pgyer.com/apiv1/app/upload

	# git checkout ${PLIST_PATH}
	# . ./mergeProd.sh
	# /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" ${PLIST_PATH}
	# rm "$OUTPUTDIR/$APPNAME/$SCHEMEPROD.ipa"
	# xcodebuild -project "$APP_PROJECTPATH" -scheme "$SCHEMEPROD" archive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -quiet
	# xcodebuild -exportArchive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -exportPath "$OUTPUTDIR/$APPNAME" -exportOptionsPlist "exportProdOptions.plist" -quiet
	# curl -F "file=@$OUTPUTDIR/$APPNAME/$SCHEMEPROD.ipa" -F "uKey=$uKey" -F "_api_key=$api_key" -F "installType=2" -F "password=123456" -F "updateDescription=$description" http://qiniu-storage.pgyer.com/apiv1/app/upload
}

buildNumberPlusOne
versionPlusOne
package
