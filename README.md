# Virtual Field Service Engineer (vfse)

## Installation

Create virtual environment.

		python3 -m venv venv
		source venv/bin/activate
		pip install -r requirements-dev.txt


Run the project.

		./manange.py runserver

Visit localhost:8000 to view the landing page.

## Setup pre-commit
This project uses [pre-commit](https://pre-commit.com/) to ensure that code standard checks pass locally before pushing to the remote project repo. [Follow](https://pre-commit.com/#installation) the installation instructions, then set up hooks with `pre-commit install`.

Make sure everything is working correctly by running

    pre-commit run --all

### Setup pre-commit as pre-push hook
To use `pre-push` hooks with pre-commit, run:

    pre-commit install --hook-type pre-push
