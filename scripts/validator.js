var validator = {};
validator.formats = [];

validator.validate = function(url, key, transformUrl, data, callback)
{
	var loaded = false;
	for(var i=0;i<validator.formats.length;i++)
	{
		if(validator.formats[i].key==key) loaded = true;
	}

	if(loaded) validator.validateCards(key, transformUrl, data, callback);
	else  validator.loadFormat(url, key, function()
	{
		validator.validateCards(key, transformUrl, data, callback)
	});
};

validator.loadFormat = function(url, key, callback)
{
	console.log("validator.loadFormat called");
	
	$.get(url, null, function(data)
	{
		data.key = key;
		validator.formats.push(data);
		callback();
	});
};

validator.validateCards = function(key, transformUrl, data, callback)
{
	console.log("validator.validateCards called");

	transform.init(transformUrl, function()
	{

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
				if(validator.isValidLine(clearLine)) validLines.push(transform.normalize(clearLine));
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
	});	
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
