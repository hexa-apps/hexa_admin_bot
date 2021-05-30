require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const LocationSchema = require("./models/Location.js");

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

mongoose
  .connect(process.env.DB_CONNECTION_ISBIKE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

bot.on("message", (msg) => {
  const username = msg.from.username;
  const chatId = msg.chat.id;
  let message = "Kimsin sen ~.~";
  if (process.env.ADMINS.split(",").includes(username)) {
    const rows = db({});
    rows
      .then(function (data) {
        message = "İstek sayısı: " + data.length;
        data.forEach((row) => {
          message += `\n\nİstasyon ID: ${row.stationId}\nKullanıcı Konumu: ${row.userLocation}\nİstek Zamanı: ${row.time}`;
        });
        bot.sendMessage(chatId, message);
      })
      .catch(function (error) {
        message = "Hata: " + toString(error);
        bot.sendMessage(chatId, message);
      });
  } else {
    bot.sendMessage(chatId, message);
  }
});

async function db(filter) {
  const all = await LocationSchema.find(filter);
  return all;
}
