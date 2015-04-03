/**
 * An interactive terminal-inspired web application for the homepage of
 * jgriff.in.
 * 
 * http://github.com/wackro/homepage-2015
 */

var terminal, terminalBottom, terminalTop, terminalPrompt, terminalCaret;
var loggedIn = false;
var prompt = { plain: "user@jgriff.in:~$ ", html: "user@jgriff.in:~$&nbsp;"}

var github_repo = "http://github.com/wackro/homepage-2015";
var contact = { 
	facebook: { name: "facebook", link: "http://facebook.com/griffdogg"},
	mail: { name: "mail", link: "mailto:wackro@gmail.com" },
	linkedin: { name: "linkedin", link: "https://uk.linkedin.com/pub/joe-griffin/1b/9b2/25a" }
};

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
	addText(" * Documentation: " + github_repo, true);
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

function pause(f, quanta) {
	window.setTimeout(f, quanta*1000);
}

function format(text) {
	return text;
}

function interpret(text) {
	var splitText = text.split(' ')
	addText(terminalBottom.text());
	terminalBottom.text("");
	switch(splitText[0]) {
		case "help":
			help(splitText);
			return;
		case "about":
			about();
			return;
		case "contact":
			contact(splitText);
			return;
		case "cv":
			cv();
			return;
		case "photography":
			photography()
			return;
		case "easymode":
			easymode();
			return;
		case "info":
			info();
			return;
		case "":
			addText("");
			return;
		case "clear":
			clear();
			return;
		default:
			commandNotFound(splitText[0]);
			return;
	}
}

function cv() {
	addText("<a href='curriculum-vitae-joe-griffin.pdf' target='_blank'>Read it, absorb it.</a>", true);
	addText();
}

function easymode() {
	addText("<a href='/easymode'>Get me out of here</a>", true);
	addText();
}

function photography() {
	addText("<a href='/photography' target='_blank'>Take me there</a>", true);
	addText();
}

function clear() {
	terminalTop.text("");
}

function commandNotFound(command) {
	addText(command + ": command not found. Type `help' for a list of commands", true)
}

function info() {
	addText("Welcome to jgriff.in", true);
	addText("jgriff.in is host to a small collection of curios created and maintained by its owner.", true);
	addText();
}

function about() {
	addText("Joe Griffin", true);
	addText("London", true);
	addText("Software Development:", true);
	addText("&nbsp;&nbsp;Day time - C#", true);
	addText("&nbsp;&nbsp;Night time - Python, JavaScript", true);
	addText();
}

function help(args) {
	if (args == undefined || args.length == 1) {
		printHelp()
		return;
	}
	else if(args.length > 3) {
		addText("-bash: help: no help topics match " + "`args[1]'");
		return;
	}
	else {
		switch(args[1]) {
			case "about":
				addText("about", true);
				addText("Some words about the owner.", true);
				addText();
				return;
			case "contact":
				addText("contact [-m &lt;linkedin|email|facebook&gt;]", true);
				addText("Methods of getting hold of me. If a method is specificied, make that form of contact immediately.", true);
				addText();
				addText("&nbsp;&nbsp;Options:", true);
				addText();
				addText("&nbsp;&nbsp;&nbsp;&nbsp;-m    contact method", true);
				addText();
				addText("&nbsp;&nbsp;Arguments:", true);
				addText();
				addText("&nbsp;&nbsp;&nbsp;&nbsp;method    the form of contact to make immediately.", true);
				addText();
				return;
			case "cv":
				addText("Provides a link to my current CV", true);
				addText();
				return;
			case "photography":
				addText("Provides a link to some pictures what i took", true);
				addText();
				return;
			case "easymode":
				addText("Provides a link to get you the hell out of here", true);
				addText();
				return;
			default:
				addText("what...?", true)
				addText();
				return;
		}
	}
}

function printHelp() {
	addText("JS bash emulator", true);
	addText("These shell commands are defined internally. Type `help' to see this list.", true);
	addText("Type `help name' to find out more about the function `name'.", true);
	addText("Use `info' to find out more about jgriff.in in general.", true);
	addText();
	addText("about", true);
	addText("contact [-m &lt;linkedin|mail|facebook&gt;]", true);
	addText("cv", true);
	addText("<a href='/easymode'>easymode</a>", true);
	addText("help", true);
	addText("photography", true);
	addText();
}

function contact(args) {
	if(args.length == 3 && args[1] == "-m") {
		switch(args[2].toLowerCase()) {
			case "linkedin":
				window.open(contact.linkedin.link, "_blank");
				return;
			case "mail":
				window.location.href = contact.mail.link;
				return;
			case "facebook":
				window.open(contact.facebook.link, "_blank")
				return;
			default:
				addText("contact [-m &lt;linkedin|email|facebook&gt;]", true);
				addText();
				return;
		}
	}
	addText("<a href='" + contact.linkedin.link + "' target='_blank'>Linkedin</a>", true);
	addText("<a href='" + contact.mail.link + "' target='_blank'>Mail</a>", true);
	addText("<a href='" + contact.facebook.link + "' target='_blank'>Facebook</a>", true);
	addText();
}
