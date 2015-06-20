/*
 * An interactive terminal-inspired command line parser.
 * 
 * http://github.com/wackro/homepage-2015
 */

var terminal, terminalBottom, terminalTop, terminalPrompt, terminalCaret;

var prompt = { plain: "user@jgriff.in:~$ ", html: "user@jgriff.in:~$&nbsp;" }
var github_repo = "http://github.com/wackro/homepage-2015"
var currentHistoryitem = 0
var commandHistory = []
var commands = [{
		name: "help",
		action: function(args) {
			if(args.length == 1) {
				var output = "JS terminal, version 0.1<br/>" +
							"These shell commands are defined internally.  Type `help' to see this list.<br/>" +
							"Type `help name' to find out more about the function `name'.<br/><br/>"
				
				$.each(commands, function(index, command) {
					output += command.usage
					if(index != commands.length-1)
						output += "<br/>"
				})
				return output
			}
			else {
				var command = getCommand(args[1])
				if(command != null)
					return command.help;
				return "help: no help topics match " + args [1]
			}
		},
		usage: "help [command]",
		help: "Displays information about builtin commands.<br/><br/>If a command is specified, gives detailed help on that command, otherwise the list of help topics is printed."
	}]

$(document).ready( function() {
	init()
});

function init() {
	terminal = $("div#terminal")
	terminal.addClass("terminal")
	terminal.append("<div id='terminal-top' class='terminal'></div>")
	terminal.append("<span id='terminal-prompt'>" + prompt.html + "</span>"
		+ "<span id='terminal-bottom' class='terminal' spellCheck='false' contentEditable></span>"
		+ "<span id='terminal-caret'>&nbsp;</span>")
	terminalPrompt = terminal.find("#terminal-prompt")
	terminalCaret = terminal.find("#terminal-caret")
	terminalTop = $("#terminal #terminal-top")
	terminalBottom = $("#terminal #terminal-bottom")
	registerListeners()
	terminalPrompt.show()
	terminalCaret.show()
	type("help", 0.2, true)
}

function run(args) {
	var command = getCommand(args[0])
	if(command != null)
		return command.action(args)
	return(commandNotFound(args[0]))
}

function getCommand(command) {	
	for(var i=0;i<commands.length;i++) {
		if(commands[i].name == command)
			return commands[i]
	}
	return null
}

function registerListeners() {
	terminalBottom.keydown(function(e) {
		switch(e.keyCode) {
			case 13:	// enter
				interpret(terminalBottom.text())
				break
			case 38:	// up
				historyBack()
				break
			case 40:	// down
				historyForward()
				break
		}
	});
	terminalBottom.focusout(function(e) {
		terminalBottom.focus()
	});
}

function historyBack() {
	if(currentHistoryitem == commandHistory.length)
		return
	currentHistoryitem++
	terminalBottom.text(commandHistory[commandHistory.length - currentHistoryitem])
}

function historyForward() {
	if(terminalBottom.text() == "")
		return
	currentHistoryitem--
	terminalBottom.text(commandHistory[commandHistory.length - currentHistoryitem] || "")
}

function pause(f, quanta) {
	window.setTimeout(f, quanta*1000)
}

var currentChar = 0
function type(text, speed, hitEnter) {
	if(currentChar == text.length) {
		currentChar = 0
		if(hitEnter) {
			var e = jQuery.Event("keydown")
			e.keyCode = 13
			terminalBottom.trigger(e)
		}
		return
	}
	terminalBottom.text(terminalBottom.text() + text[currentChar++])
	pause(function(){type(text, speed, hitEnter)}, speed)
}

function write(text) {
	if(text != undefined) {
		terminalTop.html(terminalTop.html() + text)
	}
	terminalTop.html(terminalTop.html() + "<br/>")
	terminalTop.scrollTop(terminalTop.prop("scrollHeight"))
	terminalBottom.focus()
}

function interpret(text) {
	currentHistoryitem = 0
	var args = text.split(' ')
	if(text.trim() == "") {
		write("<b>" + terminalPrompt.text() + "</b>")
	}
	else {
		addHistory(text)
		write("<b>" + terminalPrompt.text() + "</b>" + terminalBottom.text() + "<br/>" + run(args) + "<br/>")
	}
	terminalBottom.text("")
}

function addHistory(text) {
	text = text.trim()
	if(text != "" && commandHistory.length == 0 || 
		(commandHistory.length >=1 && commandHistory[commandHistory.length-1] != text))
		commandHistory.push(text)
}

function commandNotFound(command) {
	return command + ": command not found. Type `help' for a list of commands"
}

function registerCommands(commands) {
	if(!Array.isArray(commands))
		return
	$.each(commands, function(index, command) {
		registerCommand(command)
	})
}

function registerCommand(command) {
	if(isCommandValid(command))
		commands.push(command)
	else
		console.log("Couldn't register command " + command)
}

function isCommandValid(command) {
	if(typeof command.name === "undefined" ||
		typeof command.usage === "undefined" ||
		typeof command.action === "undefined" ||
		typeof command.help === "undefined")
		return false
	return true
}
