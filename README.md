# yahoo2google-calendar

Yahooカレンダーのエクスポート機能が終了したため作成しました。
https://support.yahoo-net.jp/PccCalendar/s/article/H000013400
Yahooカレンダーの予定をGoogleカレンダーに移行できるツールです。

## 起動方法
### .envの用意
下記の内容を記載した、.envファイルが必要です
```
PORT=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```
### 起動
```
npm install
npm run build
npm start
```
Chromeが自動するようになっていますが、起動しない場合はコンソールに出力されるURLにアクセスしてください。
