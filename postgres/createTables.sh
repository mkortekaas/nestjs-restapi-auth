#!/bin/bash

###############################################################
## get our variables
source ../.env

###############################################################
## Simple select to list tables
list_tables="select * from pg_tables where schemaname='public' order by tablename ASC;"
list_triggers="SELECT  event_object_table AS table_name ,trigger_name FROM information_schema.triggers GROUP BY table_name , trigger_name ORDER BY table_name ,trigger_name"

###############################################################
## this one MUST be run as the super user on the database once / connect may/maynot be needed
#\connect apitemplate;  
#CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

###############################################################
## Drop tables to recreate below - have to drop before starting to recreate
##  NOTE: the create extension will fail if not on an account that has full perms
##
read -r -d '' drop_tables <<EOF
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stub CASCADE;
DROP TRIGGER IF EXISTS update_users_on on users;
DROP TRIGGER IF EXISTS update_stub_on on stub;
DROP FUNCTION IF EXISTS update_lastupdated CASCADE;
EOF

###############################################################
## The following are the create variables

## The idea here is all user types are users, what they can do is defined in relationships
read -r -d '' my_users <<EOF
CREATE TABLE users (
 user_uuid UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
 created_by_uuid UUID NOT NULL,
 active BOOLEAN DEFAULT FALSE,  
 invite_email TEXT,
 invite_phone TEXT,
 invite_email_sent BOOLEAN DEFAULT FALSE,
 invite_last_sent_time TIMESTAMP[],
 notifications TEXT,
 auth0_userid TEXT,
 fusionauth_uuid UUID,
 lastupdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE FUNCTION update_lastupdated()
RETURNS TRIGGER AS \$$
BEGIN 
      NEW.lastupdated = now();
      RETURN NEW;
END;
\$$ language 'plpgsql';
CREATE TRIGGER update_users_on
       BEFORE UPDATE
       ON users
       FOR EACH ROW
EXECUTE PROCEDURE update_lastupdated();
EOF

## Stub - for development sample only
read -r -d '' my_stub <<EOF
CREATE TABLE stub (
 stub_uuid UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
 created_by_uuid UUID NOT NULL references users(user_uuid),
 active BOOLEAN DEFAULT FALSE,  
  lastupdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_stub_on
       BEFORE UPDATE
       ON stub
       FOR EACH ROW
EXECUTE PROCEDURE update_lastupdated();
EOF

###############################################################
## Actually create the tables above
##
perfAction() {
    ## Change for psql options vs heroku // change security as required
    psql $PGURI -c "$1"
    #heroku pg:psql --app mk-apitemplate -c "$1"
}

perfAction "$drop_tables"
perfAction "$list_tables"
perfAction "$list_triggers"
read -p "Press Any Key to Continue..." -n1 -s
perfAction "$my_users"
perfAction "$my_stub"
perfAction "$list_tables"
perfAction "$list_triggers"
