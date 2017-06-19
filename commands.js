var x = [
    {
		name: "about",
		action: function(args) {
					if(args.length > 1) {
						return about.usage
					}
					var output = "Joe Griffin<br/>London<br/>Software Developer:<br/>Daytime: C#<br/>Nighttime: Python/JS"
					return output
				},
		usage: "about",
		help: "Displays information about the owner of this page."
	},
	{
		name: "contact",
		action: function(args) {
			return "redacted"
		},
		usage: "contact [linkedin|mail|facebook]",
		help: "Displays information about getting hold of the owner of this page.<br/><br/>If a method is specified, carries out that method of contact immediately, otherwise a list of contact details is printed."
	},
	{
		name: "cv",
		action: function(args) {
			return "<a href='curriculum-vitae-joe-griffin.pdf' target='_blank'>Read it, absorb it.</a>"
		},
		usage: "cv",
		help: "Provides a link to my CV."
	},
	{
		name: "photography",
		action: function(args) {
			return "<a href='/photography' target='_blank'>Take me there.</a>"
		},
		usage: "photography",
		help: "Provides a link to my photography portfolio."
	},
	{
		name: "easymode",
		action: function(args) {
			return "<a href='/easymode'>Get me out of here.</a>"
		},
		usage: "<a href='/easymode'>easymode</a>",
		help: "Provides a link to get you the hell out of here."
	}
]
