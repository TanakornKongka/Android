README-FIRST

Update 09-12-2565 ระวัง เปิด mobile-survey ผิด folder 
work version จะอยู่ที่ directory IonicRepository

===========================================
ระวังใน package.json ต้องไม่มี node-sass
เปลี่ยน @types/lodash, typescript ใน devDepencencies ให้เป็น 2 version นี้
เพื่อแก้ปัญหา error lodash
"@types/lodash": "^4.14.179",
"typescript": "^3.9.10"
===========================================

SRP Survey ใช้ Cordova ไม่ได้ใช้ capacitor 
จึงต้องใช้ node v10.22.0  รันคำสั่ง ionic build เท่านั้น

ต้องใช้ node version 10 ถึง run ได้ 
เวลาเปลี่ยน node version ให้พิมพ์คำสั่ง 
Nvm list // เพื่อ เช็ค version node ที่ติดตั้ง
แล้วพิมพ์​ nvm use 10.22.0

จากนั้นให้ใช้ ionic info ตรวจสอบ version กับ environment ที่โพสไว้ใน git.pccth.com

Ionic Cordova build
Ionic Cordova platform add iOS

ถ้าต้องการ   clean ให้ใช้
Ionic Cordova clean
Ionic Cordova platform remove iOS

พอ add เสร็จ ให้แก้ไขไฟล์  SRP Survey-Info.plist โดยเอาไฟล์ที่อยู่ใน desktop > SRP Survey ไปทับ
(Config bypass ค่า this app requires….. ให้หายไป)

แล้วเปิด Xcode เปิด project SRP Survey 

PROBLEM: path does not exist  www (ตอน รัน Xcode) ให้ใช้คำสั่ง Cordova build iOS ใน vs code

SRP Survey folder (หาค่อนข้างยากกกก) ให้เปิด Favorites ด้านบนสุด จะอยู่ใน Users > fm > Repository > survey-mobile
ไปที่ Platform > iOS > แล้วหาไฟล์ .xcodeproj ซึ่งทุกครั้งที่มีการ build ใหม่ ต้องทำการ ลบ platform > ios แล้ว add ios ใหม่ทุกครั้ง
ไม่งั้น อาจได้ config เก่าไม่ผ่าน

*** อีกวิธีเปิด folder IonicRepository คือใช้ vs code เปิด project อื่นๆที่อยู่ใน IonicRepository แล้วเลือก folder ด้วย Reveal in Finder

เวลาเลือก archive ให้เลือก เป็น  SRP Survey > iPhone. (ห้ามเลือกเป็น CordovaLib > iPhone) ไม่ถูกต้อง
และ left pane ทางด้านซ้าย ให้เลือกเป็น SRP Survey project ไม่ใช่เลือก CordovaLib project หรือ CordovaLib

ถ้าเมนู Run หาไม่เจอ จะเป็นเพราะว่าเราเลือก CordovaLib ซึ่งผิด ต้องเป็น project ที่เราต้องการ run เท่านั้น

ถ้าเจอ path does not exist www ให้แก้แบบนี้ 
1) adding www to Targets > Build Phases > Copy Bundle Resources > add www folder
หรือ
2) PROBLEM: path does not exist  www (ตอน รัน Xcode) ให้ใช้คำสั่ง Cordova build iOS ใน vs code

https://dl.dropboxusercontent.com/s/mswyazmccbl2i00/icon512.png
https://dl.dropboxusercontent.com/s/lznma2zjl2k3518/icon57.png
https://dl.dropboxusercontent.com/s/mswyazmccbl2i00/icon512.png

