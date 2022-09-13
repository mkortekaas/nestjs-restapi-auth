#!/bin/bash

###############################################################
## get our variables
source ../.env

###############################################################
read -r -d '' my_tables <<EOF
select * from pg_tables where schemaname='public';
EOF

read -r -d '' my_structure <<EOF
select table_name, column_name, data_type, character_maximum_length, column_default, is_nullable from information_schema.columns 
where table_name in ( select tablename from pg_tables where schemaname = 'public')
order by table_name ASC;
EOF

perfAction() {
    ## Change for local vs heroku // change security as required
    psql $PGURI -c "$1"
    #heroku pg:psql --app mk-apitemplate -c "$1"
}

perfAction "$my_tables"
perfAction "$my_structure"

