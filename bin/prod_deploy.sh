set -u

CONFIG_FILE=prod_deploy.env

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Configuration file $CONFIG_FILE does not exist. Please create it."
    exit 1
fi

# read configuration from configuration file
source $CONFIG_FILE

REMOTE_NAME=production

# create remote for connecting with the server
docker context create $REMOTE_NAME --docker "host=ssh://${SERVER_USERNAME}@${SERVER_ADDRESS}" --default-stack-orchestrator swarm
docker context update $REMOTE_NAME --docker "host=ssh://${SERVER_USERNAME}@${SERVER_ADDRESS}"

make prod_up