#!/bin/bash

### Source what we need to execute
source ./.env
SRV="http://localhost:${PORT}"

# Build up our USER_UUID so we don't have to deal with pulling as DB changes
SELECT="select user_uuid from users where invite_email = '${USR1_EMAIL}' LIMIT 1"
RETVAL=`psql -t ${PGURI} -c "${SELECT}"`
USER_UUID=`echo ${RETVAL} | xargs`

# need a valid stub-uuid
SELECT="select stub_uuid from stub LIMIT 1"
RETVAL=`psql -t ${PGURI} -c "${SELECT}"`
STUB_UUID=`echo ${RETVAL} | xargs`

getURL() {
     echo ${1}
     curl --header "Authorization: Bearer ${TOKEN}" --header 'accept: application/json' --header "Content-Type: application/json"  ${2} ; echo
}

dataURL () {
     echo ${1}
     curl --request ${2} --data "${3}" --header "Authorization: Bearer ${TOKEN}" --header "Content-Type: application/json" ${4} ; echo
}

##echo $USER_UUID ; echo $BUILD_UUID ; echo $DOOR_UUID

# DATASTR="{\"initial_password\":\"${INV_PASS}\",\"invite_email\":\"${INV_EMAIL}\",\"invite_phone\":\"${INV_PHONE}\"}" ; dataURL "--- Add User ------" POST "${DATASTR}" ${SRV}/apiV1/users
# getURL "--- Profile User ---" ${SRV}/apiV1/users/profile
# dataURL "--- UpdateMe ------" PUT '{"active":false}' ${SRV}/apiV1/users
getURL "--- ALL Users ------" ${SRV}/apiV1/users?start=0\&count=20
# dataURL "--- Update User ---" PUT '{"active":true,"notifications":"kortekaas","invite_email_sent":true,"auth0_userid":"google-oauth2|100282972960089574941"}' ${SRV}/apiV1/users/${USER_UUID}
# getURL "--- ALL Users ------" ${SRV}/apiV1/users?start=0\&count=20
# getURL "--- Single User ----" ${SRV}/apiV1/users/${USER_UUID}
# dataURL "--- Remove User ---" DELETE "{}" ${SRV}/apiV1/users/${USER_UUID}
# getURL "--- Single User ---" ${SRV}/apiV1/users/${USER_UUID} 

echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"

getURL "--- Stub ---" ${SRV}/stub 
# DATASTR="{\"active\": false }" ; dataURL "--- Add Stub ---" POST "${DATASTR}" ${SRV}/stub
# DATASTR="{\"user_uuid\": \"${USER_UUID}\", \"active\": false }" ; dataURL "--- Add Stub ---" POST "${DATASTR}" ${SRV}/stub 
# dataURL "--- Update Stub ---" PUT '{"active":false}' ${SRV}/stub/${STUB_UUID} 
# getURL "--- Single Stub ---" ${SRV}/stub/${STUB_UUID}
# dataURL "--- Remove Stub ---" DELETE {} ${SRV}/stub/${STUB_UUID} 

