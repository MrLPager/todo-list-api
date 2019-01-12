FROM node:8-jessie

# AWS Credentials for local working
ENV AWS_ACCESS_KEY_ID xxx
ENV AWS_SECRET_ACCESS_KEY xxx
ENV AWS_REGION eu-west-1

USER root

# Install the latest Docker CE binaries
RUN apt-get update && \
    apt-get -y install apt-transport-https \
        ca-certificates \
        curl \
        gnupg2 \
        software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository \
        "deb [arch=amd64] https://download.docker.com/linux/debian \
        $(lsb_release -cs) \
        stable" && \
   apt-get update && \
   apt-get -y install docker-ce

# Install (AWS CLI, ECS-CLI, jq)
RUN apt-get -y install awscli \
    python3-pip && \
    pip3 install --upgrade awscli

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

CMD npm run start