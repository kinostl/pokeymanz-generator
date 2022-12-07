shopt -s extglob
SOURCE=./deps/sprites/sprites/pokemon/
DESTINATION=../src/assets/sprites/

cd `dirname $0`
cp $SOURCE/+([0-9]).png $DESTINATION

