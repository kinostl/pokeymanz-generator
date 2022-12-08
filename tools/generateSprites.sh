shopt -s extglob
SOURCE=./deps/sprites/sprites/pokemon/
SCRIPT=$(realpath "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
DESTINATION=$SCRIPTPATH/../src/assets/sprites.tar

TEMPD=$(mktemp -d)

cd $TEMPD
cp $SCRIPTPATH/$SOURCE/+([0-9]).png .

for file in $(ls $TEMPD)
do
    PKMN=$(jq -r --arg file $file '.[$file] // empty' $SCRIPTPATH/pokemon_name_id_map.json )
    if [ -n "$PKMN" ]
    then
        mv $file $PKMN
    else
        rm $file
    fi
done

tar --transform 's/.*\///g' --owner=arceus --group=pokemon -cf $DESTINATION $TEMPD 
rm -rf $TEMPD