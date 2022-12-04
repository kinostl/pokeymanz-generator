def simplifyMoves: 
	{
		move: .move.name, 
		details: 
			(.version_group_details[] 
			| {version: .version_group.name, method: .move_learn_method.name})
	}
;

def sortByVersionAndMethod:
	.
	| group_by(.details.version)
	| map(
		{ 
			(.[0].details.version):
				group_by(.details.method)
				| map({(.[0].details.method): map(.move)})
		}
	)
;

def getFormattedPokemon:
	{
		id, 
		name,
		details:{
			id, 
			name,
			category,
			height,
			weight,
			types: [.types[].type.name], 
			entries
		},
		abilities: [.abilities[].ability.name],
		moves: ([.moves[] | simplifyMoves] | sortByVersionAndMethod)
	};

. | getFormattedPokemon
