const config = require('../../../media/config.json');
const Trello = require('trello');
const trello = new Trello(config.trello.key, config.trello.token);

exports.run = (message, args, suffix, client) => {
	if (!args[0]) return message.channel.send('So you want to suggest nothing? Nothing at all? Really? No.');
	let splitified = suffix.split('\n');
	let channel = client.channels.get(config.trello.channel);

	let attachments = message.attachments.array().map(a => a ? a.url : '');

	let footer = attachments.length
		? `Attached:\n${attachments.map(a => `[${a.name}](${a.attachment})`).join('\n')}\n\n*Suggested by ${message.author.tag} (${message.author.id})*`
		: `*Suggested by ${message.author.tag} (${message.author.id})*`;

	trello.addCard(splitified[0],
		splitified[1]
		? splitified.slice(1).join('\n') + `\n\n${footer}`
		: footer,
		config.trello.board
	).then(card => {
		channel.send({
			embed: {
				author: {
					name: splitified[0],
					url: card.url
				},
				description: splitified[1] ? splitified[1] : '*No further info provided. ;-;*',
				footer: {
					text: `Suggested by ${message.author.tag}`,
					icon_url: message.author.displayAvatarURL
				},
				color: 0x00c140
			},
			files: attachments
		});

		message.channel.send(`Thanks, your suggestion might be added someday :thumbsup:${message.guild && message.guild.name === 'Arthur Official Discord' ? '' : `\nCheck the support server - ${client.config.info.guildLink} to see the if your suggestion gets accepted.`}`);
	}).catch(err => {
		message.channel.send(`I couldn't add the card for some reason.. Heck man that's weird, could you report this on my support server? - ${client.config.info.guildLink}\n${err}`)
	})
};

exports.config = {
	enabled: true,
	permLevel: 1,
	aliases: ['suggestion', 'iwant']
};

exports.help = {
	name: 'Suggest',
	description: 'Suggest a command or feature to be added to Arthur.',
	usage: 'suggest <suggestion>',
	help: 'Suggest something to be added to Arthur.',
	category: 'Other'
};
