import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4001;
const SECRET = "super_secret_key"; // ⚠️ à mettre en .env plus tard

// 🔹 API test
app.get("/", (req, res) => {
  res.send("✅ API Gestion Pneu Rouen est en ligne !");
});

// 🔹 Register
app.post("/api/auth/register", (req, res) => {
  const { prenom, nom, mot_de_passe } = req.body;

  if (!prenom || !nom || !mot_de_passe) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const nom_utilisateur = `${prenom.toLowerCase()}_${nom.toLowerCase()}`;

  // Vérifie si l’utilisateur existe déjà
  const existingUser = db.prepare("SELECT * FROM utilisateurs WHERE nom_utilisateur = ?").get(nom_utilisateur);
  if (existingUser) {
    return res.status(400).json({ error: "Utilisateur déjà existant" });
  }

  // Hash du mot de passe
  const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);

  // Insertion
  const stmt = db.prepare("INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, nom, prenom) VALUES (?, ?, ?, ?)");
  const result = stmt.run(nom_utilisateur, hashedPassword, nom, prenom);

  res.json({ message: "Utilisateur créé", user: { id: result.lastInsertRowid, nom_utilisateur, prenom, nom } });
});

// 🔹 Login
app.post("/api/auth/login", (req, res) => {
  const { nom_utilisateur, mot_de_passe } = req.body;

  const user = db.prepare("SELECT * FROM utilisateurs WHERE nom_utilisateur = ?").get(nom_utilisateur);
  if (!user) {
    return res.status(400).json({ error: "Utilisateur introuvable" });
  }

  const validPassword = bcrypt.compareSync(mot_de_passe, user.mot_de_passe);
  if (!validPassword) {
    return res.status(400).json({ error: "Mot de passe incorrect" });
  }

  const token = jwt.sign({ id: user.id, nom_utilisateur: user.nom_utilisateur }, SECRET, { expiresIn: "1h" });

  res.json({ message: "Connexion réussie", token, user: { id: user.id, nom_utilisateur: user.nom_utilisateur, prenom: user.prenom, nom: user.nom } });
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
