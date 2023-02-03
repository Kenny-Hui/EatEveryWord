# Eat Every Word
This is the source code for the [Eat Every Word](https://botsin.space/@EatEveryWord) bot.
Not that fancy but I guess it works???

### Config (config/config.json)
- `instanceUrl`: The URL of your mastodon instance
- `onReplit`: This should be set to true if you are hosting this on replit, which utilize the replit database and will save the value properly.
- `prefix`: This is a string that is prepended before the message, set it to null if you don't need any prefix.
- `finalMessage` - This is a string that will be sent after all word has been successfully sent. After that the bot will shut down.
- `schedule` - Cron schedule, check https://crontab.guru/ for details. 
- `postConfig`: An object that represents the options when sending toots. See https://docs.joinmastodon.org/methods/statuses/#form-data-parameters for details.
- `accessToken` - The access token that is shown after you created an Application. (DO NOT SHARE!)

**Note:** Access Token can be stored in either config.json, or as an environment variable (ACCESS_TOKEN=XXXXX node index.js)

## License
This project is licensed under the MIT License