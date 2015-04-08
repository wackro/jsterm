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

function run(args) {
	var action = getAction(args[0]);
	if(action != null)
		return action(args);
	return(commandNotFound(args[0]));
}

function getAction(command) {	
	for(var i=0;i<commands.length;i++) {
		if(commands[i].name == command) {
			var action = window[command];
			if(typeof action === "function")
				return action;
		}
	}
	return null;
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
	write("Login as: user");
	pause("initText_2()", 1);
}

function initText_2() {
	write("user@jgriff.in's password: ", true);
	pause("initText_3()", 2);
}

function initText_3() {
	write("Welcome to jgriff.in<br/><br/>" +
			"* Documentation: <a href='" + github_repo + "' target='_blank'>" + github_repo + "</a>");
	if($.cookie("lastLogin") == undefined) {
		var date = new Date();
		$.cookie("lastLogin", date.toString());
	}
	write("Last Login: " + $.cookie("lastLogin"));
	loggedIn = true;
	terminalPrompt.show();
	terminalCaret.show();
	pause("initText_4()", 1);
}

function initText_4() {
	type("help", 0.2, true);
}

var currentChar = 0;
function type(text, speed, hitEnter) {
	if(currentChar == text.length) {
		currentChar = 0;
		if(hitEnter) {
			var e = jQuery.Event("keydown");
			e.keyCode = 13;
			terminalBottom.trigger(e);
		}
		return;
	}
	terminalBottom.text(terminalBottom.text() + text[currentChar]);
	currentChar++;
	pause(type(text, speed, hitEnter), speed);
}

function write(text) {
	terminalTop.scrollTop(terminalTop.height());
	if(text != undefined) {
		terminalTop.html(terminalTop.html() + text);
	}
	terminalTop.html(terminalTop.html() + "<br/>");
	terminalBottom.focus();
}

function interpret(text) {
	var args = text.split(' ');
	if(text == "")
		write("<b>" + terminalPrompt.text() + "</b>");
	else
		write("<b>" + terminalPrompt.text() + "</b>" + terminalBottom.text() + "<br/>" + run(args) + "<br/>");
	terminalBottom.text("");
}

function commandNotFound(command) {
	return command + ": command not found. Type `help' for a list of commands";
}

