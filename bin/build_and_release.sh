set -u

CONFIG_FILE=build_and_release.env

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Configuration file $CONFIG_FILE does not exist. Please create it."
    exit 1
fi

# read configuration from configuration file
source $CONFIG_FILE

# try to build image first, so that any errors will be reported as soon as possible
docker build -t $IMAGE_NAME:latest .
BUILD_SUCCESS=$?
if [ $BUILD_SUCCESS -ne 0 ]; then
    echo "Build failed. Fix errors and rerun the build."
    exit 2
fi

# ask about docker deployment, if user says yes, login to docker
read -p "Push image to docker hub (y/n)? [n]" PUSH_TO_DOCKER_REGISTRY_RESPONSE
if [[ $PUSH_TO_DOCKER_REGISTRY_RESPONSE == "y" || $PUSH_TO_DOCKER_REGISTRY_RESPONSE == "Y" ]]; then

    # keep repeating loop until login is successful
    while :
    do
        echo "Logging in as $DOCKER_USERNAME"
        docker login --username $DOCKER_USERNAME
        LOGIN_SUCCESS=$?

        if [ $LOGIN_SUCCESS -ne 0 ]; then
            echo "Login failed. Try again. (hold ctrl+c for exit)"
        else
            break
        fi
    done

    # bump version (or not, if user leaves version blank)
    echo "Update version (leave blank for no version increment)"
    yarn version

    # yarn version creates a tag, so check which tag is latest
    CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null)
    TAG_CURRENT_VERSION=0
    if [ ! -z $CURRENT_VERSION ]; then
        TAG_CURRENT_VERSION=1
    fi

    # above command could return blank string if no tags have been added yet

    # push and tag if configured
    if [ $TAG_CURRENT_VERSION -eq 1 ]; then
        echo "Tagging image with version ${CURRENT_VERSION}."
        docker tag $IMAGE_NAME:latest $IMAGE_NAME:$CURRENT_VERSION
    fi

    echo "Pushing ${IMAGE_NAME}:latest to registry."

    docker push $IMAGE_NAME:latest

    if [ ! -z $CURRENT_VERSION ]; then
        echo "Pushing ${IMAGE_NAME}:${CURRENT_VERSION} to registry."
        docker push $IMAGE_NAME:$CURRENT_VERSION
    fi

    echo "Image ${IMAGE_NAME}:latest was pushed to registry."

    if [ $TAG_CURRENT_VERSION -eq 1 ]; then
        echo "Image was tagged with ${IMAGE_NAME}${CURRENT_VERSION} and pushed to the registry."
    else
        echo "No version was tagged or pushed."
    fi
else
    echo "Built image was tagged ${IMAGE_NAME}:latest, no pushes or version changes were made."
fi