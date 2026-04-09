var validator = {};
validator.formats = [];

validator.validate = function(url, key, data, callback)
{
	if(validator.formats[key])
	{
		validator.validateCards(key, data, callback);
	} 
	else
	{
		validator.loadFormat(url, key, function()
		{
			validator.validateCards(key, data, callback)
		});
	}  
};

validator.loadFormat = function(url, key, callback)
{
	console.log("validator.loadFormat called");
	
	$.get(url, null, function(data)
	{
		data.key = key;
		data.transform = [];

		for(var i=0;i<data.cards.length;i++)
		{
			if(data.cards[i].includes(" // "))
			{
				var front = data.cards[i].split(" // ")[0];
				data.transform.push({ "front": front, "name": data.cards[i] });
			}
		}

		validator.formats.push(data);
		callback();
	});
};

validator.validateCards = function(key, data, callback)
{
	console.log("validator.validateCards called");

	if(data.length==0)
	{
		callback([]);
	} 
	else
	{
		var format = null;
		for(var i=0;i<validator.formats.length;i++)
		{
			if(validator.formats[i].key==key) format = validator.formats[i];
		}

		var lines = data.match(/[^\r\n]+/g);
		var validLines = [];
		for(var i=0;i<lines.length;i++)
		{
			var clearLine = validator.clearLine(lines[i]);
			if(validator.isValidLine(clearLine)) validLines.push(validator.normalizeMultiFace(format, clearLine));
		}
		
		var output = [];
		for(var i=0;i<validLines.length;i++)
		{
			if(validator.includesCaseInsensitive(validLines[i], format.banned))
			{
				var errorMessage = validLines[i] + " is banned in this format";
				output.push({ "error": true, "message": errorMessage, "card": validLines[i] });
			}
			else
			{
				if(!validator.includesCaseInsensitive(validLines[i], format.cards))
				{
					var errorMessage = validLines[i] + " is not part of this format";
					output.push({ "error": true, "message": errorMessage, "card": validLines[i] });
				}
				else
				{
					output.push({ "error": false, "message": "OK", "card": validLines[i] });
				}
			}
		}

		callback(output)
	}
};

validator.includesCaseInsensitive = function(value, list)
{
	for(var i=0;i<list.length;i++)
	{
		if(value.toLowerCase() == list[i].toLowerCase()) return true;
	}
	return false;
};

validator.isValidLine = function(line)
{
	if(line.length==0) return false;
	if(line.match(/^#/gm)) return false;
	return true;
};

validator.clearLine = function(line)
{
	line = line.replace(/^\d+\s/gm, ""); // Removes "2 "
	line = line.replace(/^\d+x\s/gm, ""); // Removes "2x "
	line = line.replace(/\(.*\)/gm, "");  // Removes "(SET")"
	line = line.replace(/\*\w+\*/gm, "");  // Removes "*F*"
	line = line.replace(/^\s+/gm, "");  // Trims leading space
	line = line.replace(/\s+$/gm, "");  // Trims trailing space
	return line;
};

validator.normalizeMultiFace = function(format, card)
{
	for(var i=0;i<format.transform.length;i++)
	{
		if(card.toLowerCase()==format.transform[i].front.toLowerCase()) 
		{
			console.log(card + " normalized to " + format.transform[i].name)
			return format.transform[i].name;
		}
	}
	return card;
};
