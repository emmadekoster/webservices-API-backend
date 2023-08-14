# Examenopdracht Web Services

- Student: Emma De Koster
- Studentennummer: 202186541
- E-mailadres: emma.dekoster@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- ...

## Opstarten

Om de API te kunnen starten moet er een .env file aanwezig zijn in de root van deze folder. Deze moet minstens volgende data bevatten:

```
NODE_ENV="development"

DATABASE_USERNAME=""
DATABASE_PASSWORD=""

AUTH_JWKS_URI="https://restaurantsvm.eu.auth0.com/.well-known/jwks.json"

AUTH_AUDIENCE="https://restaurant-API-emmadekoster-hogentVM.be"
AUTH_ISSUER="https://restaurantsvm.eu.auth0.com/"

AUTH_USER_INFO="https://restaurantsvm.eu.auth0.com/userinfo"
```

Zorg ervoor dat deze zaken aangepast zijn voor jouw lokale database.

Vervolgens kunnen we de app runnen adhv het `yarn start` commando.

Als je de app in productie wilt runnen kan dit adhv het `yarn start:prod` commando.

## Testen

De testen kunnen worden gerunt door een .env.test file te configureren (gelijkaardig aan de .env file). En door vervolgens het `yarn test` commando te runnen. De coverage hiervan kan je opvragen door `yarn test:coverage` uit te voeren.
