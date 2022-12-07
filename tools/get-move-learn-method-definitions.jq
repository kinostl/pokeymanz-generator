def filterDescriptions($lang):
    .descriptions
    |map(select(.language.name == $lang))
    |map(.description)
;

def filterNames($lang):
    .names
    |map(select(.language.name == $lang))
    |map(.name)
;

def getMoveLearnMethod($lang):
    {
        id: .name,
        name: filterNames($lang)[0],
        descriptions: filterDescriptions($lang)[0]
    }
;

. | getMoveLearnMethod("en")