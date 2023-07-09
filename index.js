const config = require("./config.json");
const colors = require("colors");

// Setup Discord
const Discord = require("discord.js");

// Setup Webhook
const webhook = new Discord.WebhookClient({url: config.discord.webhook});


// Setup Express
const express = require("express");
const app = express();

// Setup Routes
app.get("/log/:data", async (req, res) => {
	const data = JSON.parse(decodeURIComponent(req.params.data));
	if (data.password !== config.password) return res.sendStatus(403);
	switch (data.type) {
		case "prespawn": // Vehicle Spawned
			webhook.send({
				embeds: [{
					title: "Vehicle Spawning",
					color: 0xffff00,
					description: `__**${data.server_identity}**__\n\nVID: ${data.metadata.vehicle_id}\n[${data.metadata.owner.name}](https://steamcommunity.com/profiles/${data.metadata.owner.steam_id}) is spawning \`${data.metadata.filename}\``,
					timestamp: new Date()
				}]
			});
			break;
		case "spawn": // Vehicle Spawned, send another embed with updated info
			webhook.send({
				embeds: [{
					title: "Vehicle Spawned",
					color: 0x00ff00,
					description: `__**${data.server_identity}**__\n\nVID: ${data.metadata.vehicle_id}\n[${data.metadata.owner.name}](https://steamcommunity.com/profiles/${data.metadata.owner.steam_id}) has spawned \`${data.metadata.filename}\``,
					fields: [
						{
							name: "Vehicle Stats",
							value: `**Mass:** ${data.vehicledata.mass}\n**Voxel Count:** ${data.vehicledata.voxels}`
						}
					],
					timestamp: new Date()
				}]
			});
			break;
		case "despawn": // Vehicle despawned
			webhook.send({
				embeds: [{
					title: "Vehicle Despawned",
					color: 0xff0000,
					description: `__**${data.server_identity}**__\n\nVID: ${data.metadata.vehicle_id}\n[${data.metadata.owner.name}](https://steamcommunity.com/profiles/${data.metadata.owner.steam_id}) has despawned \`${data.metadata.filename}\``,
					timestamp: new Date()
				}]
			});
			break;
		}
	res.sendStatus(204);
});

const startTime = new Date();
console.log(`${colors.cyan("[INFO]")} Starting Up...`);
app.listen(config.port, () => {
	console.log(`${colors.cyan("[INFO]")} Started Express Server On Port ${config.port}!`);
	console.log(`${colors.cyan("[INFO]")} Startup Took ${new Date() - startTime}ms!`);
});