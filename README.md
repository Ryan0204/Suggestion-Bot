# OUTDATED - Update will be uploaded soon
## 💡 Suggestion-Bot
**💡 Suggestion Bot 一個讓用戶提議以及投票的機器人**
> 本項目需要MongoDB數據庫

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white&color=5865F2) 

## 🖥 功能
<hr />
- 機器人信息 (/ping) <br />
- 設置建議頻道 (/setup-suggestion) <br />
- 回覆指定建議訊息 (/reply <訊息ID> <類型> <原因>) <br />
- 機器人控制面板 (/manage-bot) (擁有者) <br />

<br />

## 📥 安裝
<hr />

1. 複製程式碼
```sh
git clone https://github.com/Ryan0204/Suggestion-Bot.git
```
2. 進入機器人文件夾
```sh 
cd Suggestion-Bot
```
3. 安裝所需套件
```sh
npm install
```
4. 填寫 `config.json.example` 並重新命名成 `config.json`
5. 啟動機器人
```sh
node shard.js
```

<br />

## ⚙️ 設定檔
<hr />

```json
{
  "token": "", 
  // Discord 機器人登入 Token
  "mongooseConnectionString": "", 
  // MongoDB 數據庫登入連結
  "prefix": "s!",
  // 機器人的前綴
  "activity": "/help | OuO 編程社群", 
  // 機器人狀態文字
  "status": "idle", 
  // 機器人狀態 (online / dnd / idle)
  "present": "PLAYING", 
  // 機器人活動狀態 (PLAYING / WATCHING)

  "developers": [""],
  // 擁有者 ID ["660649920013008926", "906415095473655810"]

  "color": {
    "main": "#ff3c00",
    "error": "#ff5f8e",
    "success": "#99ff9c",

    "red": "#ff5a48",
    "orange": "#ffca4d",
    "yellow": "#ffcc5c",
    "green": "#74ff89",
    "purple": "#7d5eff",
    "pink": "#ff88d2",
    "grey": "#2f3136",
    "white": "#ffffff",
    "blue": "#5865F2"
  },
  "webhook" : {
    "join": "",
    // 加入伺服器提示 Webhook URL
    "leave": "",
    // 離開伺服器提示 Webhook URL
    "error": ""
    // 錯誤提示 Webhook URL
    "command": ""
    // 使用指令記錄 Webhook URL
  }
}

```
<br />

## 💿 示例
<hr />
<img src="https://cdn.ssrv.xyz/r/u8HJnQ.jpeg"  width=50% height=50%>
<img src="https://cdn.ssrv.xyz/r/SOT8ra.png"  width=50% height=50%>
<img src="https://cdn.ssrv.xyz/r/pyCXMi.png"  width=50% height=50%>

<br />

## 🙏 貢獻者

|    名稱     |    內容     |
|:---------:|:---------:|
| Ryan0204  |  創辦人/開發者  |
| Windowsed | 貢獻者 |
| 夜貓 | 貢獻者 |

<br />

## ⚠️ 版權

- 您有權拍攝和分享視頻，但您必須在視頻中提及我們和我們的伺服器
- 您不能在您網站上的任何地方使用我們的品牌並聲稱它是您自己的
- 您有權以書面形式分享，但您必須在文章中提及我們，我們的伺服器
- 你不能說“我們做的”
- 你不能賣這個機器人
- 你不能更改以下程式：
<img src="https://imgur.com/ulSwMm9.png" width=30% height=30%>
<img src="https://imgur.com/rZ9D2DS.png" width=30% height=30%>

