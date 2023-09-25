# Teste Konvix Backend (Adonis.js)

Projeto desenvolvido na versão 5 do Adonis.js, com o intuito de atender as funcionalidades do teste (login, cadastro de clientes, vendas e relatórios.). Utilizando o banco sqlite fornecido.

### 📋 Pré-requisitos

A versão do `Node.js` deve estar na `18.17.0 ou superior`.

## 🚀 Começando

Para executar esta aplicação em seu ambiente local, siga os passos abaixo:

### 🔧 Instalação

#### 1. Clone o repositório:

```shell
git clone https://github.com/xuniorss/konvix-backend-teste.git
```

#### 2. Navegue até o diretório do projeto:

```shell
cd konvix-backend-teste
```

#### 3. Instale as dependências:

```shell
npm i
# ou
yarn
```

#### 4. Coloque o banco `db-teste.db` na raiz diretório `database`, ficando da seguinte maneira `database/db-teste.db`

## ⚙️ Configuração para início da aplicação

1. No arquivo `.env` informe:

```js
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=DjJlWeWU1MuPanjgWBfkv2C8EaZnOD2E
DRIVE_DISK=local
DB_CONNECTION=sqlite
DB_PATH=database/db-teste.db
```

### 🏃‍♂️ Iniciando o projeto

```shell
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

## 🛠️ Algumas libs utilizadas

-  [typescript](https://www.typescriptlang.org/)
-  [phc-argon2](https://www.npmjs.com/package/phc-argon2)

---

por [Gilberto Fortunato](https://github.com/xuniorss)
