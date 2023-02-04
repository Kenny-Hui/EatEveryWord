const cron = require('node-cron');
const config = require('./config/config.json');
const wordList = require('./words.js');
const fs = require('fs');
const Mastodon = require("./mastodon");
const COUNT_PATH = "data/count.txt";
let replitDB;
let mastodonClient;
let currentCount = 0;

async function readData() {
    if(config.onReplit) {
        return await replitDB.get("count");
    } else {
        if(fs.existsSync(COUNT_PATH)) {
            let count = fs.readFileSync(COUNT_PATH);
            let countInt = parseInt(count);
            if(!isNaN(countInt)) {
                return countInt;
            }
        }
        return 0;
    }
}

function saveData(count) {
    if(config.onReplit) {
        replitDB.set("count", currentCount);
    } else {
        fs.writeFileSync(COUNT_PATH, count.toString());
    }
}

function increment() {
    currentCount++;
    saveData(currentCount);
}

async function sendNextWord() {
    increment();
    await toot(wordList[currentCount])
}

async function startUp() {
    if(config.onReplit) {
        let Replit = require('./replit');
        replitDB = new Replit();
    }

    mastodonClient = new Mastodon(config.instanceUrl, (config.accessToken || process.env["ACCESS_TOKEN"]));
    currentCount = await readData();
    let authData = await mastodonClient.authorize();

    if(authData.error != null) {
        console.log("Unable to login: " + authData.error);
        return;
    }

    console.log("Bot started! Last word is " + wordList[currentCount] + ".");

    if(authData.tag != null) {
        console.log("Logged in as " + authData.tag);
    }

    let schedule = cron.schedule(config.schedule, async () => {
        let totalWordLength = wordList.length - 1;
        if(currentCount < totalWordLength) {
            await sendNextWord();
        } else if (currentCount >= totalWordLength) {
            increment();

            let finalMessage = config.finalMessage;
            if(finalMessage != null) {
                await toot(finalMessage);
            }

            console.log("All word has been sent, stopping.");
            schedule.stop();
        }
    });
}

async function toot(message) {
    if(mastodonClient != null && message != null) {
        const postParams = config.postConfig || {};
        const msgPrepend = config.prefix || "";
        postParams.status = msgPrepend + message;

        let post = await mastodonClient.post(postParams);
        if(post.success) {
            console.log(message + ": " + post.url);
        }
    }
}

function validateConfig() {
    if(config.instanceUrl == null) {
        console.log("[Invalid Config] No URL provided in config.json. Your API URL should be something like \"https://botsin.space\".");
        return false;
    }

    if(!cron.validate(config.schedule)) {
        console.log("[Invalid Config] Invalid cron syntax in config.json. Learn more at https://crontab.guru/");
        return false;
    }

    if(typeof config.postConfig !== 'object') {
        console.log("[Invalid Config] \"postConfig\" in config.json must be an object, or null for default.")
        return false;
    }

    if((config.accessToken || process.env["ACCESS_TOKEN"]) == null) {
        console.log("[Invalid Config] No access token provided.")
        return false;
    }

    return true;
}

if(validateConfig()) {
    startUp();
}