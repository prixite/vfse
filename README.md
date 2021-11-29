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

Create superuser.

      ./manage.py createsuperuser

Run the backend.

      ./manage.py runserver

Build the frontend. You need to run this command whenever you pull new changes from the server.

      npm install

Run the frontend dev server

      npm run start

Visit localhost:8000 to view the landing page.

## Generate test data
You can run the following Django command to generate test data.

    ./manage.py generate

To regenerate test data.

    ./manage.py flush
    ./manage.py generate

## Setup pre-commit

This project uses [pre-commit](https://pre-commit.com/) to ensure that code standard checks pass locally before pushing to the remote project repo. [Follow](https://pre-commit.com/#installation) the installation instructions, then set up hooks with `pre-commit install`.

Make sure everything is working correctly by running

    pre-commit run --all

### Setup pre-commit as pre-push hook

To use `pre-push` hooks with pre-commit, run:

    pre-commit install --hook-type pre-push


## Frontend <> Backend contract

API definitions are available at http://localhost:8000/api/docs. We use [OpenAPI](https://swagger.io/specification/) specifications.

Generate OpenAPI specification. The output file should be committed.

    ./scripts/generate_swagger


Generate TypeScript schema. The output file should be committed.

    npm run generate_schema
