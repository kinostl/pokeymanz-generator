# Function so we can do internationalization later if needed

def getFlavorText($lang):
    .flavor_text_entries
    | map(select(.language.name==$lang))
    | map({(.version.name): .flavor_text})
;

def getEntries($lang):
    {
        id: .name,
        entries: (. | getFlavorText($lang) | add)
    };

. | getEntries("en")