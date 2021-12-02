#!/usr/bin/env bash
./manage.py generate_swagger frontend/swagger.json
npm run generate_api
