#!/bin/bash

###############################################################
## get our variables
source ../.env

## WHAT Values to Use (email comes from local-vars)
SEED_UUID='f24a3e6e-df05-49a5-bfec-9c0a6ffdfb02'
USR1_UUID='fa0aabb6-3b6a-4d8c-93da-6cf63348295d'
USR2_UUID='dfa786ed-ec81-4a35-ad56-a6933a637c21'

## WHAT Values to Use (email comes from local-vars)
USR1_PHONE='+12125551212'
USR1_ADDR='555 Mockingbird Lane'
USR1_CITY='New York'
USR1_ZIP='10002'
USR1_TAG='Munsters'
USR1_FLRS=666

USR2_PHONE='+12135551212'
USR2_ADDR='11222 Dilling Street'
USR2_CITY='Beverly Hills'
USR2_ZIP='90210'
USR2_TAG='Bradys'
USR2_FLRS=2

### USERS
read -r -d '' seed_users <<EOF
INSERT INTO users(user_uuid, active, created_by_uuid, invite_email, invite_phone)
VALUES ('${USR1_UUID}', TRUE, '${SEED_UUID}', '${USR1_EMAIL}', '${USR1_PHONE}'),
       ('${USR2_UUID}', TRUE, '${SEED_UUID}', '${USR2_EMAIL}', '${USR2_PHONE}');
select * from users;
EOF

### STUB
read -r -d '' seed_stub <<EOF
INSERT INTO stub(active, created_by_uuid)
VALUES (TRUE, (select user_uuid from users where invite_email = '${USR1_EMAIL}') ),
       (TRUE, (select user_uuid from users where invite_email = '${USR2_EMAIL}') );
select * from stub;
EOF

perfAction() {
       ## Change for local vs heroku // change security as required
       echo $1
       psql $PGURI -c "$1"
       #heroku pg:psql --app mk-apitemplate -c "$1"
}

perfAction "$seed_users"
perfAction "$seed_stub"
