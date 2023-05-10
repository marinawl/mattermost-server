FROM ubuntu:jammy-20230308@sha256:7a57c69fe1e9d5b97c5fe649849e79f2cfc3bf11d10bbd5218b4eb61716aebe6


# Setting bash as our shell, and enabling pipefail option
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Some ENV variables
ENV PATH="/mattermost/bin:${PATH}"
ARG PUID=2000
ARG PGID=2000
ARG MM_PACKAGE="../dist/mattermost-team-linux-amd64.tar.gz"
ARG MM_CONFIG="../config/config.json"

# # Install needed packages and indirect dependencies
RUN apt-get update \
  && apt-get install --no-install-recommends -y \
  ca-certificates \
  curl \
  mime-support \
  unrtf \
  wv \
  poppler-utils \
  tidy \
  && rm -rf /var/lib/apt/lists/*

ADD ${MM_PACKAGE} /
COPY ${MM_CONFIG} /mattermost/config

# Set mattermost group/user and download Mattermost
RUN mkdir -p /mattermost/data /mattermost/plugins /mattermost/client/plugins \
  && addgroup -gid ${PGID} mattermost \
  && adduser -q --disabled-password --uid ${PUID} --gid ${PGID} --gecos "" --home /mattermost mattermost \
  #&& chown -R mattermost:mattermost ${MM_PACKAGE} \
  #&& if [ -n "$MM_PACKAGE" ]; then tar -xzf $MM_PACKAGE > /dev/null ; \
  #else echo "please set the MM_PACKAGE" ; exit 127 ; fi \
  && chmod -R 755 /mattermost/bin \
  && chown -R mattermost:mattermost /mattermost /mattermost/bin /mattermost/data /mattermost/plugins /mattermost/client/plugins

# We should refrain from running as privileged user
USER mattermost

#Healthcheck to make sure container is ready
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:8065/api/v4/system/ping || exit 1

# Configure entrypoint and command
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
WORKDIR /mattermost
CMD ["mattermost"]

EXPOSE 8065 8067 8074 8075

# Declare volumes for mount point directories
VOLUME ["/mattermost/data", "/mattermost/logs", "/mattermost/config", "/mattermost/plugins", "/mattermost/client/plugins"]
