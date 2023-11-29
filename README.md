### Quick setup — if you've done this kind of thing before
Bundle id
```bash
DEV: th.go.excise.srpsurvey
PRD: -
```
Git global setup
```bash
git config --global user.name "First Last"
git config --global user.email "email@gmail.com"
```
### BUILD DETAIL
keytool -genkey -v -keystore srpsurvey.keystore -alias srpsurvey -keyalg RSA -keysize 2048 -validity 10000
srpsurvey.keystore
Srpsurvey@1

sudo jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore srpsurvey.keystore app-release-unsigned.apk srpsurvey
sudo jarsigner -verify -verbose -certs app-release-unsigned.apk
sudo ./zipalign -v 4 app-release-unsigned.apk srpsurvey.apk

In-House Plist
```bash
https://srp.excise.go.th/EDSRP/mobile/application/srpsurvey.ipa
https://srp.excise.go.th/EDSRP/mobile/images/logoapp57.png
https://srp.excise.go.th/EDSRP/mobile/images/logoapp512.png
```