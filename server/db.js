// server/db.js  (ESM)
import Database from "better-sqlite3";
import path from "path";
import os from "os";
import fs from "fs";

const documents = path.join(os.homedir(), "Documents");
const dataRoot = process.env.DATA_DIR || path.join(documents, "gestion pneu roeun");

// Crée la structure demandée
fs.mkdirSync(path.join(dataRoot, "database"), { recursive: true });
fs.mkdirSync(path.join(dataRoot, "facture", "facture_cacher"), { recursive: true });
fs.mkdirSync(path.join(dataRoot, "devis"), { recursive: true });

// DB dans Documents/gestion pneu roeun/database/database.sqlite
const dbPath = path.join(dataRoot, "database", "database.sqlite");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_utilisateur TEXT UNIQUE NOT NULL,
  mot_de_passe TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'
);
`);

export default db;
