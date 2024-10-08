<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Welcome to Nest CMS server!
Nest-CMS-api is a fully REST api server for content management system using Prisma ORM with Mysql Database.

## For NestJS Documentation
Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

### Installation

```bash
# download
$ mkdir your project // create new folder
$ git clone git@github.com:mr-ben-jeckson/cms-nest-api.git

# installation
$ cd your-project-directory
$ npm install

# perparation
$ cat .env.example // copy .env.example content
$ nano .env // create new .env file

# create new mysql database and set DATABASE_URL in .env

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
