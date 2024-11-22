var transform = {};
transform.loaded = false;
transform.data = [];

transform.init = function(url, callback)
{
	if(transform.loaded)
	{
		callback();
	}
	else
	{
		transform.load(url, true, callback)
	}
};

transform.load = function(url, hasMore, callback)
{
	console.log("transform.load called for " + url);
	
	$.get(url, null, function(data)
	{
		if(transform==null) transform = {};
		
		for(var i=0;i<data.data.length;i++)
		{
			transform.data.push({ "front": data.data[i].card_faces[0].name, "name": data.data[i].name });
		}
		
		if(data.has_more)
		{
			transform.load(data.next_page, true, callback);
		}
		else
		{
			transform.loaded = true;
			callback();
		}
	});
};

transform.normalize = function(card)
{
	if(!transform.loaded)
	{
		throw new Error("transform.init must be called before transform.normalize");
	}

	for(var i=0;i<transform.data.length;i++)
	{
		if(card.toLowerCase()==transform.data[i].front.toLowerCase()) 
		{
			console.log(card + " normalized to " + transform.data[i].name)
			return transform.data[i].name;
		}
	}
	return card;
};