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

def getAbility($lang):
    {
        id,
        effect: filterFlavorText($lang) | add,
        name: filterNames($lang)
    }
;

. | getAbility("en")