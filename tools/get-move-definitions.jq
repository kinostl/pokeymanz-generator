
def filterFlavorText($lang):
    .flavor_text_entries
    |map(select(.language.name == $lang))
    |map({(.version_group.name): .flavor_text})
;

def filterNames($lang):
    .names
    |map(select(.language.name == $lang))
    |map(.name)
;

def getMove($lang):
    {
        id: .name,
        category: .damage_class.name,
        type: .type.name,
        effect: filterFlavorText($lang) | add,
        name: filterNames($lang)[0]
    }
;

. | getMove("en")