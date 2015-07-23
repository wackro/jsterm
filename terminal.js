/*
 * An interactive terminal-inspired command line parser.
 * 
 * http://github.com/wackro/homepage-2015
 */

var terminal, terminalBottom, terminalTop, terminalPrompt, terminalCaret
var prompt
var currentHistoryitem = 0
var commandHistory = []
var globalCommands = [{
		name: "help",
		action: function(args) {
			if(args.length == 1) {
				var output = "JS terminal, version 0.1<br/>" +
							"These shell commands are defined internally.  Type `help' to see this list.<br/>" +
							"Type `help name' to find out more about the function `name'.<br/><br/>"
				
				$.each(globalCommands, function(index, command) {
					output += command.usage
					if(index != globalCommands.length-1)
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

function init(container, prompt) {
	terminal = $(container)
	terminal.addClass("terminal")
	terminal.append("<div id='terminal-top' class='terminal'></div>")
    this.prompt = { plain: prompt, html: prompt.replace(" ", "&nbsp;") }
	terminal.append("<span id='terminal-prompt'>" + this.prompt.html + "</span>"
		+ "<span id='terminal-bottom' class='terminal' spellCheck='false' contentEditable></span>"
		+ "<span id='terminal-caret'>&nbsp;</span>")
	terminalPrompt = terminal.find("#terminal-prompt")
	terminalCaret = terminal.find("#terminal-caret")
	terminalTop = $("#terminal #terminal-top")
	terminalBottom = $("#terminal #terminal-bottom")
	registerListeners()
	terminalPrompt.show()
	terminalCaret.show()
    terminalBottom.focus()
}

function run(args) {
	var command = getCommand(args[0])
	if(command != null)
		return command.action(args)
	return args[0] + ": command not found. Type `help' for a list of commands"
    
    function getCommand(command) {	
	    for(var i=0;i<globalCommands.length;i++) {
		    if(globalCommands[i].name == command)
			    return globalCommands[i]
	    }
	    return null
    }
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

    function addHistory(text) {
	    text = text.trim()
	    if(text != "" && commandHistory.length == 0 || 
		    (commandHistory.length >=1 && commandHistory[commandHistory.length-1] != text))
		    commandHistory.push(text)
    }
    
    function write(text) {
	    if(text != undefined) {
		    terminalTop.html(terminalTop.html() + text)
	    }
	    terminalTop.html(terminalTop.html() + "<br/>")
	    terminalTop.scrollTop(terminalTop.prop("scrollHeight"))
	    terminalBottom.focus()
    }
}

function registerCommands(commands) {
	if(!Array.isArray(commands))
		return
	$.each(commands, function(index, command) {
		if(isCommandValid(command))
		    globalCommands.push(command)
	    else
		    console.log("Couldn't register command " + command)
	})
    globalCommands.sort(sortCommandsByName)
    
    function isCommandValid(command) {
	    if(typeof command.name === "undefined" ||
		    typeof command.usage === "undefined" ||
		    typeof command.action === "undefined" ||
		    typeof command.help === "undefined")
		    return false
	    return true
    }
    
    function sortCommandsByName(a, b) {
        return (a.name > b.name) ? 1 : ( a.name < b.name ? -1 : 0)
    }
}




