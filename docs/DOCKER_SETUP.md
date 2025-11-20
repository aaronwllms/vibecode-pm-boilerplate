# Docker Installation Guide

Docker is required to run Supabase locally. This guide will help you install Docker Desktop on your machine.

## What is Docker?

Docker allows you to run Supabase's database and services in isolated containers on your machine, providing a consistent development environment that matches production.

## Installation by Operating System

### macOS

#### Option 1: Docker Desktop (Recommended)

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Mac"
   - Choose the right version:
     - **Apple Silicon (M1/M2/M3)**: Download "Mac with Apple chip"
     - **Intel Mac**: Download "Mac with Intel chip"

2. **Install Docker Desktop:**
   - Open the downloaded `.dmg` file
   - Drag the Docker icon to your Applications folder
   - Open Docker from Applications (may take a minute to start)

3. **Complete Setup:**
   - Docker Desktop will ask for permissions - click "OK"
   - You may need to enter your password
   - Wait for Docker to start (Docker icon appears in menu bar)

4. **Verify Installation:**
   ```bash
   docker --version
   docker-compose --version
   ```

   You should see version numbers for both commands.

#### Option 2: Homebrew

If you use Homebrew:

```bash
brew install --cask docker
```

Then open Docker Desktop from Applications.

---

### Windows

#### Prerequisites
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- OR Windows 11 64-bit: Home, Pro, Enterprise, or Education (Build 22000 or higher)
- WSL 2 (Windows Subsystem for Linux) - Docker Desktop will help you install this

#### Installation Steps

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"

2. **Run the Installer:**
   - Double-click `Docker Desktop Installer.exe`
   - Follow the installation wizard
   - When prompted, ensure "Use WSL 2 instead of Hyper-V" is selected

3. **Enable WSL 2 (if not already enabled):**
   - Docker Desktop will prompt you if WSL 2 isn't installed
   - Follow the on-screen instructions or:
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   ```
   - Restart your computer if prompted

4. **Start Docker Desktop:**
   - Launch Docker Desktop from the Start menu
   - Accept the service agreement
   - Wait for Docker to start

5. **Verify Installation:**
   ```powershell
   docker --version
   docker-compose --version
   ```

---

### Linux

#### Ubuntu / Debian

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify installation
docker --version
docker compose version
```

#### Fedora / RHEL / CentOS

```bash
# Install Docker
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

#### Arch Linux

```bash
# Install Docker
sudo pacman -S docker docker-compose

# Start Docker
sudo systemctl start docker.service
sudo systemctl enable docker.service

# Add your user to the docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## Post-Installation

### 1. Verify Docker is Running

```bash
# Should show version info
docker --version

# Should list running containers (empty at first)
docker ps

# Test with hello-world image
docker run hello-world
```

If the hello-world container runs successfully, Docker is working!

### 2. Configure Resources (Optional)

Docker Desktop users can adjust resources:

**macOS / Windows:**
1. Open Docker Desktop
2. Go to Settings → Resources
3. Recommended for Supabase:
   - **CPUs**: 2-4 cores
   - **Memory**: 4-8 GB
   - **Swap**: 1 GB
   - **Disk**: 20+ GB

### 3. Start Supabase

Now that Docker is installed, you can start Supabase:

```bash
# Navigate to your project
cd /path/to/supa-next-starter

# Start Supabase (will download images first time)
pnpm supabase:start
```

First-time startup will take 1-2 minutes as Docker downloads the required images (~500MB).

---

## Troubleshooting

### macOS: "Docker Desktop requires a newer version of macOS"

**Solution:** Update macOS to the latest version, or use an older Docker Desktop version compatible with your macOS version.

### Windows: "WSL 2 installation is incomplete"

**Solution:**
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart your computer
4. Relaunch Docker Desktop

### Linux: "Permission denied while trying to connect to Docker"

**Solution:**
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker
```

### "Docker daemon is not running"

**Solution:**
- **macOS/Windows**: Open Docker Desktop application
- **Linux**: 
  ```bash
  sudo systemctl start docker
  ```

### Slow Performance

**Solution:**
- Increase Docker Desktop memory allocation (Settings → Resources)
- Ensure your disk has sufficient space (20+ GB free)
- Close other resource-intensive applications

### Cannot Download Images

**Solution:**
- Check your internet connection
- Check if you're behind a corporate firewall/proxy
- Configure Docker to use a proxy if needed (Docker Desktop → Settings → Resources → Proxies)

---

## Uninstalling Docker

### macOS
1. Quit Docker Desktop
2. Drag Docker from Applications to Trash
3. Remove data: `rm -rf ~/Library/Group\ Containers/group.com.docker`

### Windows
1. Uninstall Docker Desktop from Windows Settings → Apps
2. Optionally uninstall WSL 2: `wsl --unregister docker-desktop`

### Linux
```bash
# Ubuntu/Debian
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo rm -rf /var/lib/docker

# Fedora
sudo dnf remove docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo rm -rf /var/lib/docker
```

---

## Next Steps

Once Docker is installed and running:

1. Read [Local Development Guide](./LOCAL_DEVELOPMENT.md)
2. Start Supabase: `pnpm supabase:start`
3. Set up your `.env.local` file
4. Start developing!

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Desktop Manual](https://docs.docker.com/desktop/)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)

