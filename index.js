const config = require("./config.json");
const colors = require("colors");
const axios = require("axios");

// Setup Discord
const Discord = require("discord.js");

// Setup Webhook
const webhook = new Discord.WebhookClient({url: config.discord.webhook});


// Setup Express
const express = require("express");
const app = express();

// Setup Routes
app.get("/log/:data", async (req, res) => {
	console.log(req.params.data);
	const data = JSON.parse(decodeURIComponent(req.params.data));
	if (data.password !== config.password) return res.sendStatus(403);
	console.log(data.sid)
	await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steamkey}&steamids=${data.sid}`).then((response) => {
		console.log(response.data)
		webhook.send({
			isUser: true,
			username: data.name,
			content: data.msg,
			avatarURL: response.data.response.players[0].avatarfull
		})
	});
	res.sendStatus(204);
});

const startTime = new Date();
console.log(`${colors.cyan("[INFO]")} Starting Up...`);
app.listen(config.port, () => {
	console.log(`${colors.cyan("[INFO]")} Started Express Server On Port ${config.port}!`);
	console.log(`${colors.cyan("[INFO]")} Startup Took ${new Date() - startTime}ms!`);
});