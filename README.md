# SERVICE-MANAGEMENT-INC

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
Developers: [Cecilia](https://github.com/responsibleparty), [Hai](https://github.com/caubenondo), [Marshall](https://github.com/marshall-rust), [Patrick](https://github.com/monacoglynn), [Richmond](https://github.com/richmonddz)

##[Live Demo](https://project2-rllr.herokuapp.com/)

## Table of Contents

- [Description](#Description)
- [Concept](#Concept)
- [User Story](#UserStory)
- [Technology](#Tech)
- [Installation](#Installation)
- [API](#API)
- [Future Developement](#Future)

# Description

Have you ever broken something at home and wanted it fixed? Is your job so busy that you're unable to walk your dog everyday? Is you son or daughter in need of piano lessons? Well SM Inc. is the platform for you! With many skilled and talented people out there you're sure to find someone to help you out!

## Concept

We wanted to build a website where everyone could post and offer services that people could use. From freelance web designers, piano teachers, and dog walkers! SM Inc. is a place were people can conncect and support freelance and small buisness.

## User Story

As a customer I want to find a service while supporting small business.

## Installation

To install necessary dependencies, run the following command:

###### Install npm packages

```
  npm i
```

###### Create database in mySQL

```
   mysql -u <username> -p
```

```
   source ./db/schema.sql
```

###### Connect mySQL database with .env file

```
  DB_USER=''
  DB_PW=''
  DB_NAME='pokemon_db'
```

###### Seed database with default data

```
npm run seed
```

###### Start server

```
npm run start
```

###### Watch server for development

```
npm run watch
```

You need to install `nodemon` before running

## Future Development

- Add trading features
- Enhanced UI
- Battle online
- Instant message with friends

![splash-page](public/images/splash.png)
