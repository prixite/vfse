# Virtual Field Service Engineer (vFSE)

## Installation

Create virtual environment.

    python3 -m venv venv

Activate virtual environment. You need to activate virtual environment before running any Django command. For example, any command starting with manage.py is a Django command.

    source venv/bin/activate

Install dependencies in virtual environment. You will have to run this command whenever you pull new changes from the server.

    pip install -r requirements-dev.txt

Create an environment file (.env) in the root of the project. You can get the initial file by copying env.sample to .env.

Run the migrations. You will have to run this command whenever you pull new changes from the server.

    ./manage.py migrate

You can run the following Django command to generate test data.

    ./manage.py generate

To regenerate test data.

    ./manage.py flush
    ./manage.py generate

Run the backend.

    ./manage.py runserver

Build the frontend. You need to run this command whenever you pull new changes from the server.

    npm install

Run the frontend dev server

    npm run start

Visit localhost:8000 to view the landing page.

Run the SSH Service

    python run.py --port=8888 --origin=http://127.0.0.1:8000

Create a token using Django Admin panel for user `ssh-user@example.com`, Copy the key to /webssh/.env/. Get intial file from /webssh/env.sample

## Test users
The `generate` command will generate the following users in the DB. Every user's password is admin.

- child-customer-admin@example.com
- cryo-admin@example.com
- cryo-fse@example.com
- cryo@example.com
- customer-admin@example.com
- end-user@example.com
- fse-admin@example.com
- fse@example.com
- mfa@example.com
- one-time@example.com
- other-customer-admin@example.com
- other-user-admin@example.com
- parent-customer-admin@example.com
- super-admin@example.com
- super-manager@example.com
- user-admin@example.com
- view-only@example.com

## Setup pre-commit

This project uses [pre-commit](https://pre-commit.com/) to ensure that code standard checks pass locally before pushing to the remote project repo. [Follow](https://pre-commit.com/#installation) the installation instructions, then set up hooks with `pre-commit install`.

Make sure everything is working correctly by running

    pre-commit run --all

### Setup pre-commit as pre-push hook

To use `pre-push` hooks with pre-commit, run:

    pre-commit install --hook-type pre-push


## Frontend <> Backend contract

API definitions are available at http://localhost:8000/openapi/. We use [OpenAPI](https://swagger.io/specification/) specifications.

Generate OpenAPI specification using the following command. This will create/update two files. Commit both files.

    ./scripts/generate_swagger


## Connect local frontend with staging
Copy the following settings in .env:

    API_SERVER="https://vfse.prixite.com/api/"
    PUBLIC_PATH="/"
    AUTH_TOKEN="fake" # Copy from staging
    WEBSSH_SERVER="https://vfse.prixite.com/webssh/"
    WEBSSH_WS_SERVER="wss://vfse.prixite.com/webssh/"


Run the frontend using:

    npm run dev:serve


Go to http://localhost:3000/clients/1/.
