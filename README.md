# Open Web UI Custom

This project is a customized web user interface application. The following instructions will help you set up and run the project on a Debian OS.

## Prerequisites

Ensure you have the following installed on your Debian system:

- Docker
- Python
- Golang 1.22.2
- Node.js

## Installation

### 1. Manual Installation

#### a. Install Docker
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```
```bash
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

#### b. Install python
```bash
sudo apt update
sudo apt install -y python3 python3-pip
```

#### c. Install golang
```bash
wget https://go.dev/dl/go1.22.2.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.2.linux-amd64.tar.gz
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile
source ~/.profile
```

#### d. Install nodejs
```bash
sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
```
```bash
sudo apt-get install -y nodejs
```

## Installation

### Installation by Docker
```bash
wget gs://farismnrr-gclouds.appspot.com/openwebui.sh
chmod +x openwebui.sh
./openwebui.sh
```

## Usage
After completing the installation steps, the application will be running on port 80. You can access it through your web browser by navigating to http://localhost.

## Contributing
Feel free to open issues or submit pull requests if you have any improvements or bug fixes.

## License
This project is licensed under the MIT License.


```bash
Feel free to customize this `README.md` file further according to your project's specific needs and details.
```
