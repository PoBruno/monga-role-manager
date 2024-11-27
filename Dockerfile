  GNU nano 6.2                                           Dockerfile
# Usar a imagem oficial do Node.js como base
FROM node:18.19.1-alpine

# Definir diretório de trabalho no container
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Comando para rodar o bot
CMD ["node", "bots/bot01.js"]
