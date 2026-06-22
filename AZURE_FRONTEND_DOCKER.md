# Despliegue del frontend en Azure con Docker

Esta guía despliega el frontend Vite + React como contenedor Docker servido por Nginx.

## 1. Requisitos en Azure

- VM Linux Ubuntu.
- Puerto `80` abierto en `Networking > Inbound port rules`.
- Backend accesible desde internet, por ejemplo:
  - API: `http://BACKEND_PUBLIC_IP:8080/api`
  - WebSocket SockJS/STOMP: `http://BACKEND_PUBLIC_IP:8080/ws`

Si el backend todavía no está desplegado, el frontend abrirá, pero login/eventos/compras fallarán porque no podrá llamar a la API.

## 2. Instalar Docker en la VM

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
```

## 3. Construir la imagen

Desde la carpeta del frontend:

```bash
docker build \
  -t ticketflow-frontend \
  --build-arg VITE_API_URL=http://BACKEND_PUBLIC_IP:8080/api \
  --build-arg VITE_WS_URL=http://BACKEND_PUBLIC_IP:8080/ws \
  .
```

Ejemplo si tu backend estuviera en `68.211.73.180`:

```bash
docker build \
  -t ticketflow-frontend \
  --build-arg VITE_API_URL=http://68.211.73.180:8080/api \
  --build-arg VITE_WS_URL=http://68.211.73.180:8080/ws \
  .
```

## 4. Ejecutar el contenedor

```bash
docker rm -f ticketflow-frontend || true

docker run -d \
  --name ticketflow-frontend \
  --restart unless-stopped \
  -p 80:80 \
  ticketflow-frontend
```

Luego abre:

```txt
http://FRONTEND_PUBLIC_IP
```

Con la VM de la captura:

```txt
http://68.211.73.179
```

## 5. Comandos útiles

Ver contenedores:

```bash
docker ps
```

Ver logs:

```bash
docker logs -f ticketflow-frontend
```

Reiniciar:

```bash
docker restart ticketflow-frontend
```

Eliminar:

```bash
docker rm -f ticketflow-frontend
```

## 6. Importante sobre Vite

`VITE_API_URL` y `VITE_WS_URL` se insertan durante el `docker build`.

Si cambia la IP del backend, debes reconstruir la imagen:

```bash
docker build \
  -t ticketflow-frontend \
  --build-arg VITE_API_URL=http://NUEVA_IP_BACKEND:8080/api \
  --build-arg VITE_WS_URL=http://NUEVA_IP_BACKEND:8080/ws \
  .

docker rm -f ticketflow-frontend || true
docker run -d --name ticketflow-frontend --restart unless-stopped -p 80:80 ticketflow-frontend
```
