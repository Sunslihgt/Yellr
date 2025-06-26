# 🚨 YELLR
**_Where Everyone’s Loud_**  
*...and nobody listens.*

**YELLR** is the world's most _unapologetically chaotic_ microblogging platform. 🦅 We believe in **free** speech, especially the kind that involves shouting into the void while everyone else is doing the same. 🗣️ Built for those who want to be heard 💪 - but never want to listen .

## 👷‍♂️ Development

Yellr is a _**Twitter/X clone**_ made by 3 students in a few weeks at CESI Graduate School of Engineering at Saint-Nazaire (_A3 INFO FISA 2024-2027_).<br>
The project uses the **MERN** stack (MongoDB, Express, React, Node) with Typescript, Tailwind and Nginx. The backend is built from different micro-services.

## 🗒️ Environnement files

Before running the project, you need to add a `.env` file for each backend microservice. The files should be placed at the service's root :
- `auth/.env`
- `comment/.env`
- `post/.env`
- `user/.env`

Each of these files must have a valid `MONGO_URI` :
```sh
MONGO_URI=mongodb://root:example@mongo:27017/yellr?authSource=admin
```

You also need to define a strong `ACCESS_JWT_KEY` for `auth/.env` :
```sh
ACCESS_JWT_KEY=YourStrongJWTKey123
```

## ▶️ Running the Project

### Linux

Use Make to run the project in development or production mode.

```bash
make run-dev # For development
make run-prod # For production
```

This will stop all currently running images, start all necessary services. HMR will be enabled to streamline the development process.

You can also run `make lint` to lint the project and its microservices. Refer to `Makefile` to see *all available commands*.

---

### Windows

To start the project on Windows, just run the PowerShell file :

```sh
./run-dev.ps1
```

This will stop all currently running images, start all necessary services. HMR will be enabled to streamline the development process.

You can also run `./run-prod.ps1` to build the project for deployment and prod tests.
