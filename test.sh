#! /usr/bin/env bash
set -e

TABLE_NAME='to-do-list-test'

aws dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    >/dev/null 2>&1

echo -n "AWS DynamoDB: Waiting to create Dynamodb table: $TABLE_NAME ...";

aws dynamodb wait table-exists \
    --table-name $TABLE_NAME \
&& echo -n "done." \
&& npx cross-env \
    TODOLIST_STAGE=test \
    AWS_REGION=eu-west-1 \
    jest ./test/

aws dynamodb delete-table \
    --table-name $TABLE_NAME >/dev/null 2>&1

echo -n "AWS DynamoDB: Removing testing table...";

aws dynamodb wait table-not-exists \
    --table-name $TABLE_NAME \
&& echo -n "done."