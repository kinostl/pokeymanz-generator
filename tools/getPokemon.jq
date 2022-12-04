
def getPokemon:
	{
		# id and name are here because the glue code is going to be keying all these objects by id or name.
		id, 
		details:{
			id, 
			name,
			category, # Need to pull this from Species and add it with the glue code
			height,
			weight,
			types: [.types[].type.name], 
			# entries // Pull this from Species when the game changes
		},
		abilities: [.abilities[].ability.name]
		# moves used to be here, but now they'll be pulled from Moves when the game changes
	};

. | getPokemon
