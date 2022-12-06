def filterNames($lang):
    .names
    |map(select(.language.name == $lang))
    |map(.name)
;

def getVersion($lang):
    {
        id: .name,
        name: filterNames($lang)[0]
    }
;

. | getVersion("en")