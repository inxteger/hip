#echo run build
rm ../build_file/*.apk

cp ./android/app/src/main/java/com/energymost/hipdiscoing/ShareModule.java ./node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/share/ShareModule.java

#npm install
cd android && ./gradlew assembleRelease
cd ..

cp ./android/app/build/outputs/apk/*.apk ../build_file
rm ../build_file/*unaligned.apk
