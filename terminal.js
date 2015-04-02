/**
 * An interactive terminal-inspired web application for the homepage of
 * jgriff.in.
 * 
 * http://github.com/wackro/homepage-2015
 */

var terminal, terminalBottom, terminalTop, terminalPrompt, terminalCaret;

var loggedIn = false;
var prompt = { plain: "user@jgriff.in:~$ ", html: "user@jgriff.in:~$&nbsp;" }
var github_repo = "http://github.com/wackro/homepage-2015";

var commands = [
	{
		name: "about",
		action: about,
		usage: "about",
		help: "this is the help for about"
	},
	{
		name: "contact",
		action: contact,
		usage: "contact [-m [linkedin|mail|facebook]]",
		help: "this is the help for contact"
	},
	{
		name: "help",
		action: help,
		usage: "help [command]",
		help: "there is no help for help..."
	}
];

$(document).ready( function() {
	init();
});

function init() {
	terminal = $("div#terminal");
	terminal.addClass("terminal")
	terminal.append("<div id='terminal-top' class='terminal'></div>");
	terminal.append("<span id='terminal-prompt'>" + prompt.html + "</span>"
		+ "<span id='terminal-bottom' class='terminal' spellCheck='false' contentEditable></span>"
		+ "<span id='terminal-caret'>&nbsp;</span>");
	terminalPrompt = terminal.find("#terminal-prompt");
	terminalCaret = terminal.find("#terminal-caret")
	terminalTop = $("#terminal #terminal-top");
	terminalBottom = $("#terminal #terminal-bottom");
	registerListeners()
	initText_1();
}

function run(action, args) {
	var i;
	for(i=0;i<commands.length;i++) {
		if(commands[i].name == action) {
			var matchingFunction = window[action];
			if(typeof matchingFunction === "function")
				matchingFunction(args);
				return;
		}
	}
	commandNotFound(action);
}

function registerListeners() {
	terminalBottom.keydown(function(e) {
		if(e.keyCode == 13) {
			interpret(terminalBottom.text());
		}
	});
	terminalBottom.focusout(function(e) {
		terminalBottom.focus();
	});
}

function pause(f, quanta) {
	window.setTimeout(f, quanta*1000);
}

function initText_1() {
	addText("Login as: user", true);
	pause("initText_2()", 1);
}

function initText_2() {
    addText("user@jgriff.in's password: ", true);
	pause("initText_3()", 2);
}

function initText_3() {
	addText("Welcome to jgriff.in", true);
	addText("", true);
	addText(" * Documentation: <a href='" + github_repo + "' target='_blank'>" + github_repo + "</a>", true);
	if($.cookie("lastLogin") == undefined) {
		var date = new Date();
		$.cookie("lastLogin", date.toString());
	}
	addText("Last Login: " + $.cookie("lastLogin"), true)
	addText("", false);
	loggedIn = true;
	terminalPrompt.show();
	terminalCaret.show();
	pause("initText_4()", 1);
}

function initText_4() {
	type("help", 1, true);
}

var currentChar = 0, timer;
function type(command, speed, hitEnter) {
	if(currentChar == command.length) {
		currentChar = 0;
		clearInterval(timer);
		if(hitEnter)
			var e = jQuery.Event("keydown");
			e.keyCode = 13;
			terminalBottom.trigger(e);
		return;
	}
	terminalBottom.text(terminalBottom.text() + command[currentChar]);
	currentChar++;
	timer = setInterval(type(command, speed, hitEnter), speed);
}

function addText(text, suppressUserString) {
	terminalTop.scrollTop(terminalTop.height());
	if(text != undefined) {
		if(loggedIn && !suppressUserString) {
			terminalTop.html(terminalTop.html() + "<b>" + prompt.plain + "</b>" + text);
		}
		else {
			terminalTop.html(terminalTop.html() + text);
		}
	}

	terminalTop.html(terminalTop.html() + "<br/>");
	terminalBottom.focus();
}

function interpret(text) {
	var splitText = text.split(' ')
	addText(terminalBottom.text());
	terminalBottom.text("", true);
	run(splitText[0]);
}

var contact = function(args) {
	var contactDetails = { 
		facebook: { name: "facebook", link: "http://facebook.com/griffdogg" },
		mail: { name: "mail", link: "mailto:wackro@gmail.com" },
		linkedin: { name: "linkedin", link: "https://uk.linkedin.com/pub/joe-griffin/1b/9b2/25a" }
	};
	if(args.length == 3 && args[1] == "-m") {
		switch(args[2].toLowerCase()) {
			case "linkedin":
				window.open(contactDetails.linkedin.link, "_blank");
				return;
			case "mail":
				window.location.href = contactDetails.mail.link;
				return;
			case "facebook":
				window.open(contactDetails.facebook.link, "_blank")
				return;
			default:
				addText("contact [-m &lt;linkedin|email|facebook&gt;]", true);
				addText();
				return;
		}
	}
	addText("<a href='" + contactDetails.linkedin.link + "' target='_blank'>Linkedin</a>", true);
	addText("<a href='" + contactDetails.mail.link + "' target='_blank'>Mail</a>", true);
	addText("<a href='" + contactDetails.facebook.link + "' target='_blank'>Facebook</a>", true);
	addText();
}

var about = function(args) {
	addText("Joe Griffin", true);
	addText("London", true);
	addText("Software Development:", true);
	addText("&nbsp;&nbsp;Day time - C#", true);
	addText("&nbsp;&nbsp;Night time - Python, JavaScript", true);
	addText();
}

var help = function(args) {
	addText("you asked for help", true);
	addText();
}

function commandNotFound(command) {
	addText(command + ": command not found. Type `help' for a list of commands", true)
}
