import axios from "axios";
import { Telegraf } from "telegraf";
import { TG_BOT_TOKEN } from "./config.mjs";
import { upload } from "./services.mjs";

const bot = new Telegraf(TG_BOT_TOKEN);

const uploadConfig = {
  mode: "",
};

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Qloq, puedes subir imagenes o frases para el juego what do you cheems. /image o /phrase para subir"
  );
});

bot.command("phrase", async (ctx) => {
  try {
    uploadConfig.mode = "PHRASE_TO_ANSWER";
    ctx.reply("Envie una frase para subir");
  } catch (error) {
    return ctx.reply("Ocurrio un error al subir la frase");
  }
});

bot.command("meme", async (ctx) => {
  try {
    uploadConfig.mode = "IMAGE";
    ctx.reply("Envie una imagen para subir (debe ser como documento)");
  } catch (error) {
    return ctx.reply("Ocurrio un error al subir la frase");
  }
});

bot.on("text", async (ctx) => {
  try {
    if (uploadConfig.mode === "PHRASE_TO_ANSWER") {
      const phrase = ctx.message.text;

      ctx.reply("Subiendo phrase");

      await upload({
        type: uploadConfig.mode,
        content: phrase,
        uploadMode: "telegram",
        uploadedBy: "prueba",
      });

      uploadConfig.mode = "";
      ctx.reply("Phrase subida en espera para aprobar");
    }
  } catch (error) {
    console.log(error);
    return ctx.reply("Ocurrio un error al subir la frase");
  }
});

bot.on("document", async (ctx) => {
  try {
    if (uploadConfig.mode === "IMAGE") {
      const fileId = ctx.update.message.document.file_id;
      ctx.reply("Subiendo meme...");

      const res = await axios.get(
        `https://api.telegram.org/bot${TG_BOT_TOKEN}/getFile?file_id=${fileId}`
      );

      const filePath = res.data.result.file_path;

      const urlToSend = `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${filePath}`;

      await upload({
        type: uploadConfig.mode,
        content: urlToSend,
        uploadMode: "telegram",
        uploadedBy: "prueba",
      });

      uploadConfig.mode = "";

      ctx.reply("Meme subido con éxito");
    }
  } catch (error) {
    return ctx.reply("Ocurrio un error al subir la frase");
  }
});

bot.launch();

console.log("bot init");