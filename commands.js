var commands = [
	{
		name: "about",
		action: about,
		usage: "about",
		help: "Displays information about the owner of this page."
	},
	{
		name: "contact",
		action: contact,
		usage: "contact [linkedin|mail|facebook]",
		help: "Displays information about getting hold of the owner of this page.<br/><br/>If a method is specified, carries out that method of contact immediately, otherwise a list of contact details is printed."
	},
	{
		name: "help",
		action: help,
		usage: "help [command]",
		help: "Displays information about builtin commands.<br/><br/>If a command is specified, gives detailed help on that command, otherwise the list of help topics is printed."
	}
]

var about = function(args) {
	if(args.length > 1) {
		return about.usage;
	}
	var output = "Joe Griffin<br/>London<br/>Software Developer:<br/>Daytime: C#<br/>Nighttime: Python/JS";
	return output;
}

var contact = function(args) {
	var details = { 
		facebook: { name: "facebook", link: "http://facebook.com/griffdogg" },
		mail: { name: "mail", link: "mailto:wackro@gmail.com" },
		linkedin: { name: "linkedin", link: "https://uk.linkedin.com/pub/joe-griffin/1b/9b2/25a" }
	}
	if(args.length == 1) {
		var output = "";
		output += "<a href='" + details.linkedin.link + "' target='_blank'>Linkedin</a><br/>" +
				"<a href='" + details.mail.link + "' target='_blank'>Mail</a><br/>" +
				"<a href='" + details.facebook.link + "' target='_blank'>Facebook</a>";
		return output;
	}
	else if(args.length == 2) {
		switch(args[1].toLowerCase()) {
			case "linkedin":
				window.open(details.linkedin.link, "_blank");
			case "mail":
				window.location.href = details.mail.link;
			case "facebook":
				window.open(details.facebook.link, "_blank")
			default:
				return contact.usage;
		}
		return "Opening widow...";
	}
	else {
		return contact.usage;
	}
}

var help = function(args) {
	if(args.length == 1) {
		var output = "JS terminal, version 0.1<br/>" +
					"These shell commands are defined internally.  Type `help' to see this list.<br/>" +
					"Type `help name' to find out more about the function `name'.<br/><br/>";

		$.each(commands, function(index, command) {
			output += command.usage + "<br/>";
		});
		return output;
	}
	else {
		var command = getAction(args[1]);
		if(command != null)
			return command.help;
		return "help: no help topics match " + args [1];
	}
}


