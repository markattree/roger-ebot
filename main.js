const Discord = require('discord.js');
const { isTagged, getChannelQuery, findChannel, getChannelReference } = require('./utils')
require('dotenv').config();

const filmMegathreadCategoryID = process.env.CATEGORY_ID;
const discordToken = process.env.DISCORD_TOKEN
const thumbsUp = ":thumbsup:"
const thumbsDown = ":thumbsdown:"

const client = new Discord.Client({
	intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages
	],
});

client.on(Discord.Events.ClientReady, async () => {
  console.log("logged in");
});

client.on(Discord.Events.MessageCreate, async (msg) => {
  if (!isTagged(client.user, msg) || msg.author.bot) {
    return;
  }

  const channelQuery = getChannelQuery(msg)

  const channels = new Map();

  const category = await client.channels.fetch(filmMegathreadCategoryID)
  category.children.cache.forEach(channel => {
    channels.set(channel.name, channel);
  });

  const channelNames = Array.from(channels.keys());

  if (channelQuery === "help") {
    if (channelNames.length == 0) {
      msg.reply("There are no available channels");  
    } else {
      msg.reply(`Available channels: \n${channelNames.join("\n")}`);
    }
    return;
  }

  const channel = findChannel(channelQuery, channels)
  if (!channel) {
    msg.reply(`Can't find channel ${thumbsDown}`);
    return;
  }
  
  await channel.permissionOverwrites.edit(msg.author.id, {
    [Discord.PermissionsBitField.Flags.ViewChannel]: true
  });

  await msg.reply(`Added to ${getChannelReference(channel)} ${thumbsUp}`);
});

client.on(Discord.Events.Error, async(err) => {
  console.error(err);
});

client.login(discordToken);