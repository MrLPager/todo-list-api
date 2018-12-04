#! /usr/bin/env bash
set -e

$(aws ecr get-login --no-include-email --region $AWS_REGION) \
&& npm run dev