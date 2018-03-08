_api_key=be1290e71bb2fab7a9547cda2ee37d7b
appKey=b31ce581c0d4b898270189b5962c44fd
uKey=7d42c69844b88157360fe2dc141fdf1a

# buildNumber 放在了description，从pgy得到并加1
function buildNumberPlusOne()
{
	pgyerLog=`curl -d "_api_key=$_api_key" -d "appKey=$appKey" https://www.pgyer.com/apiv2/app/view `
	buildNumber=$(echo $pgyerLog | tr ',' '\n' | awk -F : '/buildUpdateDescription/{print $2}'| sed 's/"//g' | head -1 | awk -F _ '{print $2}')
	buildNumber=$(($buildNumber+1))
	currCommit=$(git rev-parse --short HEAD)
	description="$currCommit"_"$buildNumber"
}

function version_ge() { test "$(echo "$@" | tr " " "\n" | sort -rV | head -n 1)" == "$1"; }
# 版本号 放在了pgy的buildVersion，从pgy得到并加1，之后修改本地的version配置
function versionPlusOne()
{
	oldVer=`awk -F= '/ROCK_VERSION/{print $2}' android/gradle.properties |tail -n 1`
	version=$(echo $pgyerLog | tr ',' '\n' | awk -F : '/buildVersion/{print $2}' | head -1 | sed 's/"//g')
	if version_ge $version $oldVer
	then
		version=${version%.*}.$((${version##*.}+1))
	else
		version=$oldVer
	fi
	sed -ig "s/$oldVer/$version/g" android/gradle.properties
}

# 打包上传
function configEnvAndPackage()
{
	cp ./android/customModules/ShareModule.java ./node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/share/ShareModule.java
	rm -rf ./node_modules/react-native-svg/android/build
	source configEnvScripts/findAndReplace.sh && getFileAndChangeJcenter

	cd android && ./gradlew assembleRelease
	cd -

	# cp ./android/app/build/outputs/apk/*.apk ../build_file
	# rm ../build_file/*unaligned.apk
	filePath="android/app/build/outputs/apk/app-internal-release-$version.apk"
	curl -F "file=@$filePath" -F "uKey=$uKey" -F "_api_key=$_api_key" -F "installType=2" -F "password=123456" -F "updateDescription=$description" http://qiniu-storage.pgyer.com/apiv1/app/upload
}

buildNumberPlusOne
versionPlusOne
configEnvAndPackage
