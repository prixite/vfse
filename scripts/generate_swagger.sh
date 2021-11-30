#!/usr/bin/env bash
./manage.py generate_swagger swagger.json
npm run generate_schema
