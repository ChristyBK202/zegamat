const express = require('express');                       //Framawork pour créer des serveurs web avec Node.js
const mongoose = require('mongoose');                     //ODM pour MonogoDB
const helmet = require('helmet');                         // Sécurité des en-têtes HTTP
const rateLimit = require('express-rate-limit');          //Limite le nombre de requetes 
const cors = require('cors');                             // Gère les autorisations cross-origin (entre frontend et backend)

require('dotenv').config();                               // Charge les variables d'environnement depuis .env

const authRoutes = require('./routes/auth');              // Import des routes d'authentification
const itemRoutes = require('./routes/items');             // Import des routes liées aux objets (dons, tri,
const adminRoutes = require('./routes/admin');            // Import des routes réservées à l'administrateur
const userRoutes = require('./routes/userRoutes');        

const app = express();

// Middlewares globaux
app.use(helmet());                                        //Protection des en-têtes HTTP
app.use(cors());                                          //Autoriser les requêtes cross-origin (frontend ↔ backend)
app.use(express.json());                                  // Parser automatiquement les requêtes JSON
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                  // limite chaque IP à 100 requêtes
}));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err));

// Routes API
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API AB-ZEGAMAT');
});

app.use('/api/auth', authRoutes);     // Authentification
app.use('/api/items', itemRoutes);    // Dépôt, tri, catalogue...
app.use('/api/admin', adminRoutes);   // Fonctionnalités Admin
//app.use('/api/users', userRoutes);    // Route personnalisée

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Serveur lancé sur http://localhost:${PORT}');
});