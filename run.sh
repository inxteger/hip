oldVer=`awk -F= '/ROCK_VERSION/{print $2}' android/gradle.properties |tail -n 1`

echo "Please input the new version?The old version is:$oldVer"
read version
while([[ $version == '' ]])
do
echo "Error! Please input the new version?The old version is:$oldVer"
read version
done

# sed -i '' 's/$oldVer/$version/g' android/gradle.properties
# sed -i "s/0.5.2/0.5.3/g" android/gradle\.properties
sed -i '' "s/$oldVer/$version/g" `grep $oldVer -rl  android/gradle.properties`

cp ./android/customModules/ShareModule.java ./node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/share/ShareModule.java

cd android && ./gradlew assembleRelease
cd ..

rm ../build_file/*unaligned.apk

filePath="./android/app/build/outputs/apk/app-internal-release-$version.apk"

currCommit=$(git rev-parse --short HEAD)

curl -F "file=@$filePath" -F "uKey= 24af41e3b5e5117e773a733378aefa29" -F "_api_key= 0691c7489e57a5158796f6e1e7e988bd" -F "installType=2" -F "password=123456" -F "updateDescription=$currCommit" http://qiniu-storage.pgyer.com/apiv1/app/upload
