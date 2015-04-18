/**
 * An interactive terminal-inspired web application for the homepage of jgriff.in.
 * 
 * http://github.com/wackro/homepage-2015
 */

var terminal, terminalBottom, terminalTop, terminalPrompt, terminalCaret;

var loggedIn = false;
var prompt = { plain: "user@jgriff.in:~$ ", html: "user@jgriff.in:~$&nbsp;" }
var github_repo = "http://github.com/wackro/homepage-2015";
var currentHistoryitem = 0;
var commandHistory = [];

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
	var command = getCommand(args[0]);
	if(command != null)
		return command.action(args);
	return(commandNotFound(args[0]));
}

function getCommand(command) {	
	for(var i=0;i<commands.length;i++) {
		if(commands[i].name == command)
			return commands[i]
	}
	return null;
}

function registerListeners() {
	terminalBottom.keydown(function(e) {
		switch(e.keyCode) {
			case 13:	// enter
				interpret(terminalBottom.text());
				break;
			case 38:	// up
				historyBack();
				break;
			case 40:	// down
				historyForward();
				break;
		}
	});
	terminalBottom.focusout(function(e) {
		terminalBottom.focus();
	});
}

function historyBack() {
	if(currentHistoryitem == commandHistory.length)
		return;
	currentHistoryitem++;
	terminalBottom.text(commandHistory[commandHistory.length - currentHistoryitem]);
}

function historyForward() {
	if(terminalBottom.text() == "")
		return;
	currentHistoryitem--;
	terminalBottom.text(commandHistory[commandHistory.length - currentHistoryitem] || "");
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
	terminalBottom.text(terminalBottom.text() + text[currentChar++]);
	pause(function(){type(text, speed, hitEnter)}, speed);
}

function write(text) {
	if(text != undefined) {
		terminalTop.html(terminalTop.html() + text);
	}
	terminalTop.html(terminalTop.html() + "<br/>");
	terminalTop.scrollTop(terminalTop.prop("scrollHeight"));
	terminalBottom.focus();
}

function interpret(text) {
	currentHistoryitem = 0;
	var args = text.split(' ');
	if(text.trim() == "") {
		write("<b>" + terminalPrompt.text() + "</b>");
	}
	else {
		addHistory(text);
		write("<b>" + terminalPrompt.text() + "</b>" + terminalBottom.text() + "<br/>" + run(args) + "<br/>");
	}
	terminalBottom.text("");
}

function addHistory(text) {
	text = text.trim()
	if(text != "" && commandHistory.length == 0 || 
		(commandHistory.length >=1 && commandHistory[commandHistory.length-1] != text))
		commandHistory.push(text);
}

function commandNotFound(command) {
	return command + ": command not found. Type `help' for a list of commands";
}

