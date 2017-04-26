#echo run build
rm ../build_file/*.apk

#npm install
cd android && ./gradlew assembleRelease
cd ..

cp ./android/app/build/outputs/apk/*.apk ../build_file
rm ../build_file/*unaligned.apk
