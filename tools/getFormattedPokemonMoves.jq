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
			key: (.[0].details.version),
            value: group_by(.details.method)
            | map({
                key: (.[0].details.method),
                # TODO glue code should swap the name out with an id for space reasons.
                value: map(.move)
            })
            | from_entries
		}
	)
    | from_entries
;

. | {
    # id and name are here because the glue code is going to be keying all these objects by id or name.
    id, 
    moves: ([.moves[] | simplifyMoves] | sortByVersionAndMethod) #this will probably be pulled out by the glue code.
}