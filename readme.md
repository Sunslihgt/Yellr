# 🚨 YELLR
**_Where Everyone’s Loud_**  
*...and nobody listens.*

**YELLR** is the world's most _unapologetically chaotic_ microblogging platform. 🦅 We believe in **free** speech , especially the kind that involves shouting into the void while everyone else is doing the same. 🗣️ Built for those who want to be heard 💪 - but never want to listen .

## 👷‍♂️ Development

Yellr is a _**Twitter/X clone**_ made by 3 students in a few weeks at CESI Graduate School of Engineering at Saint-Nazaire (_A3 INFO FISA 2024-2027_).<br>
The project uses the **MERN** stack (MongoDB, Express, React, Node) with Typescript, Tailwind and Nginx. The backend is built from different micro-services.

## ▶️ Running the Project

### Linux

Use Make to run the project in development or production mode.

```sh
make run-dev # Development
make run-prod # Production
```

This will stop all currently running images, start all necessary services. HMR will be enabled to streamline the development process.

You can also run `make lint` to lint the project and its microservices.

---

### Windows

To start the project on Windows, just run the PowerShell file :

```sh
./run-dev.ps1
```

This will stop all currently running images, start all necessary services. HMR will be enabled to streamline the development process.

You can also run `./run-prod.ps1` to build the project for deployment and prod tests.

## 🆗 Linting

To check code style and run linters on Linux, use the provided script:

```sh
./lint.sh
```

This script will run the configured linters and report any issues.
