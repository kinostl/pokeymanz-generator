def pluckName($lang):
    .names
    | map(select(.language.name==$lang))
    | map(.name)[0]
;

def getName($lang):
    {
        id: .name,
        order:.id,
        name: pluckName($lang)
    }
;

. | getName("en")