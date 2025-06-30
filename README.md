# Conway's Game of Life – React Fullstack App

[🔗 Zur Live-Demo](https://gameoflife-frontend.onrender.com)
 
*→ Klicke oben auf "Live Demo", um das Spiel sofort auszuprobieren.*

---

## 🧠 Projektüberblick

Dies ist eine vollständige Umsetzung von **Conway's Game of Life** mit **React** im Frontend und **Node.js + Express + MongoDB** im Backend.  
Das Projekt kombiniert klassische Simulation mit Benutzerinteraktion, Pattern-Verwaltung und Authentifizierung.

---

## 🚀 Features

- 🧬 **25×25 Startgrid** mit manueller Zellaktivierung
- 🌱 **Automatisches Grid-Wachstum**, wenn Zellen den Rand erreichen (Verdopplung der Gridgröße)
- 🟩 **Start/Pause-Schalter** zur Steuerung der Simulation
- 👤 **Benutzerauthentifizierung** mit JWT (Registrieren & Einloggen)
- 💾 **Pattern speichern/abrufen** für eingeloggte Benutzer
- 🚫 Buttons bei fehlendem Login deaktiviert
- 🧱 Klare Komponentenstruktur in React
- 📱 *(Responsives Layout in Arbeit)*

---

## 🛠️ Technologie-Stack

| Bereich            | Technologie                                     |
|--------------------|-------------------------------------------------|
| Frontend           | React, CSS Modules                              |
| Authentifizierung  | JWT, React Context API                          |
| Backend            | Node.js, Express, MongoDB Atlas (mit Mongoose)  |
| Deployment         | **Frontend & Backend beide auf Render**         |
| Versionskontrolle  | Git & GitHub                                    |

---

## 🧠 Was ich in diesem Projekt gelernt habe

- **Grid-Dynamik** in React umsetzen inkl. Größenanpassung bei Randüberschreitung
- **Zustandsverwaltung** über Komponenten hinweg mit React Context API
- **JWT-basierte Authentifizierung** mit Login, Tokenprüfung und Ablaufüberwachung
- **Benutzerbezogene Datenverwaltung** (Pattern speichern/abrufen pro Account)
- UI-Komponenten dynamisch abhängig vom Login-Zustand rendern
- **Fullstack-Deployment mit Render** für Frontend & Backend in getrennten Services

---

## 🧪 Lokale Entwicklung

```bash
# Projekt klonen
git clone https://github.com/dein-username/GameOfLife.git
cd GameOfLife

# Frontend installieren und starten
cd client
npm install
npm start

# Backend in anderem Terminal starten
cd ../server
npm install
npm run dev
