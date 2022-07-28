#!/bin/bash
echo "******************************************************* \n"
echo "lift off !!! ....."
echo "******************************************************* \n"
echo "creating database upesi"
psql postgres -c "CREATE USER upesi WITH SUPERUSER PASSWORD 'upesi'"
psql postgres -c "CREATE DATABASE upesi"
echo "******************************************************* \n"
echo "touch down ....."
echo "COMPLETED BOOTSTRAPPING NOW SHUTTING DOWN"
echo "******************************************************* \n"
exit 0
