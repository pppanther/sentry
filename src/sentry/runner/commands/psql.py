from __future__ import absolute_import, print_function

import click
import os


@click.command()
def psql():
    """
    Connect to Sentry's PostgreSQL in Docker.

    Do not use in production!
    """
    os.execl('bin/docker-psql', 'bin/docker-psql')
