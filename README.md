# Necro Lift Gym

Konditermi tag- és bérletkezelő rendszer, death metal ihletésű vizuális arculattal. Egyéni portfólióprojekt, aktuális, modern JavaScript/TypeScript stackre építve.

## Funkciók

- **Vendégek kezelése** — regisztráció, alapadatok (név, email, opcionális telefonszám)
- **Bérletek** — felnőtt/diák bérlettípus, automatikusan számított, valós idejű lejárat (30 nap)
- **Edzéstervek** — split-alapú (Bro Split / Upper-Lower / Push-Pull-Legs / egyéb), napi bontásban, gyakorlatonként piramis-jellegű szettekkel (egyedi súly/ismétlés szettenként, "bukásig" jelöléssel)

## Tech stack

**Backend:** Node.js, Express.js, Mongoose (MongoDB Atlas)
**Frontend:** React (Vite), React Router, Tailwind CSS

## Screenshotok

_(ide kerülnek majd a felület képei)_

## Indítás lokálisan

### Előfeltételek
- Node.js
- Egy MongoDB Atlas cluster (vagy helyi MongoDB) connection stringje

### Backend
```bash
cd server
npm install
```

Hozz létre egy `.env` fájlt a `server/` mappában:
```
PORT=5000
MONGODB_URI=<a saját MongoDB connection stringed>
```

```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Az alkalmazás ezután elérhető a Vite által megadott címen (alapértelmezetten `http://localhost:5173`).

## API végpontok

| Metódus | Végpont              | Leírás                          |
|---------|-----------------------|----------------------------------|
| GET     | `/api/users`           | Vendégek listázása               |
| POST    | `/api/users`           | Új vendég felvétele              |
| GET     | `/api/memberships`     | Bérletek listázása               |
| POST    | `/api/memberships`     | Új bérlet felvétele              |
| GET     | `/api/workout-plans`   | Edzéstervek listázása            |
| POST    | `/api/workout-plans`   | Új edzésterv felvétele           |

## Felhasznált MI

Claude Sonnet 5 (High - Extra effort)

## Motiváció

A projekt saját, gyakorlati adattal is feltöltött (saját Upper/Lower splitem), hogy valós használati esetet is bemutasson, ne csak seed adatot.
