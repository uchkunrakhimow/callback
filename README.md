# Callback

### Integrating Asterisk and Node.js

### Configuring docker on centos
```bash
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl start docker
docker compose up -d
```

### Run the server
```bash
npm install
docker compose up -d
```