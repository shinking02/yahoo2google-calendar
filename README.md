# yahoo2google-calendar

Yahooカレンダーのエクスポート機能が終了したため作成しました。 [参考](https://support.yahoo-net.jp/PccCalendar/s/article/H000013400)
このツールを使用することでYahooカレンダーの予定をGoogleカレンダーに移行することができます。

## 動作画面
<img width="1710" alt="スクリーンショット 2023-10-10 16 17 01" src="https://github.com/shinking02/yahoo2google-calendar/assets/72262790/2ec81378-a7c4-4df2-bded-d6984af60087">

## 起動方法
### .envの用意
.env.exampleを参考に、.envファイルを作成してください
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
Chromeが自動で起動するようになっていますが、起動しない場合はコンソールに出力されるURLにアクセスしてください。
