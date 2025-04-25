const { Livre, LivreNumerique, LivreAudio } = require('../models/livreModel');
const { Auteur } = require('../models/categoryModels');

// @desc    Récupérer tous les livres
// @route   GET /api/livres
// @access  Public
const getLivres = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construire le filtre basé sur les paramètres de requête
    const filter = {};
    
    // Filtres basiques
    if (req.query.titre) filter.titre = { $regex: req.query.titre, $options: 'i' };
    if (req.query.estPublie) filter.estPublie = req.query.estPublie === 'true';
    if (req.query.estGratuit) filter.estGratuit = req.query.estGratuit === 'true';
    if (req.query.type) filter.type = req.query.type;
    
    // Filtres de prix
    if (req.query.prixMin && req.query.prixMax) {
      filter.prix = { $gte: parseFloat(req.query.prixMin), $lte: parseFloat(req.query.prixMax) };
    } else if (req.query.prixMin) {
      filter.prix = { $gte: parseFloat(req.query.prixMin) };
    } else if (req.query.prixMax) {
      filter.prix = { $lte: parseFloat(req.query.prixMax) };
    }
    
    // Filtres de date
    if (req.query.dateDebut && req.query.dateFin) {
      filter.datePublication = { 
        $gte: new Date(req.query.dateDebut), 
        $lte: new Date(req.query.dateFin) 
      };
    }
    
    // Filtres par références
    if (req.query.categorie) filter.categoriesNiveau1 = req.query.categorie;
    if (req.query.sousCategorie) filter.categoriesNiveau2 = req.query.sousCategorie;
    if (req.query.langue) filter.langue = req.query.langue;
    if (req.query.typeLivre) filter.typeLivre = req.query.typeLivre;
    if (req.query.theme) filter.themes = req.query.theme;
    if (req.query.auteur) filter.auteurs = req.query.auteur;
    if (req.query.publicCible) filter.publicCible = req.query.publicCible;
    if (req.query.niveauLecture) filter.niveauLecture = req.query.niveauLecture;
    if (req.query.editeur) filter.editeur = req.query.editeur;
    
    // Filtres spécifiques au type de livre
    if (req.query.formatFichier && req.query.type === 'numerique') {
      filter['formatFichier'] = req.query.formatFichier;
    }
    
    if (req.query.dureeMax && req.query.type === 'audio') {
      filter['dureeMinutes'] = { $lte: parseInt(req.query.dureeMax) };
    }
    
    // Options de tri
    const sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') 
        ? req.query.sort.substring(1) 
        : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.datePublication = -1; // Par défaut, tri par date de publication (du plus récent au plus ancien)
    }

    // Exécuter la requête
    const livres = await Livre.find(filter)
      .populate('auteurs', 'nom prenom')
      .populate('editeur', 'nom prenom nomInstitution')
      .populate('langue', 'nom')
      .populate('typeLivre', 'nom')
      .populate('categoriesNiveau1', 'nom')
      .populate('categoriesNiveau2', 'nom')
      .populate('themes', 'nom')
      .populate('publicCible', 'type trancheAge')
      .populate('niveauLecture', 'niveau')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Compter le nombre total de livres correspondant aux filtres
    const total = await Livre.countDocuments(filter);

    res.json({
      livres,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Récupérer un livre par ID
// @route   GET /api/livres/:id
// @access  Public
const getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id)
      .populate('auteurs', 'nom prenom')
      .populate('editeur', 'nom prenom nomInstitution')
      .populate('langue', 'nom')
      .populate('typeLivre', 'nom')
      .populate('categoriesNiveau1', 'nom')
      .populate('categoriesNiveau2', 'nom')
      .populate('themes', 'nom')
      .populate('publicCible', 'type trancheAge')
      .populate('niveauLecture', 'niveau')
      .populate({
        path: 'commentaires',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom'
        }
      })
      .populate({
        path: 'avis',
        populate: {
          path: 'utilisateur',
          select: 'nom prenom'
        }
      });

    if (livre) {
      res.json(livre);
    } else {
      res.status(404);
      throw new Error('Livre non trouvé');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Créer un nouveau livre
// @route   POST /api/livres
// @access  Private (Écrivain, Publicateur)
const createLivre = async (req, res) => {
  try {
    const { 
      titre, 
      description, 
      prix, 
      estGratuit,
      auteurs, 
      langue, 
      typeLivre, 
      categoriesNiveau1, 
      categoriesNiveau2, 
      themes, 
      publicCible, 
      niveauLecture,
      type,
      // Champs spécifiques pour les livres numériques
      formatFichier,
      fichier,
      // Champs spécifiques pour les livres audio
      dureeMinutes,
      narrateur,
      fichierAudio
    } = req.body;

    // Vérifier les champs requis
    if (!titre || !description || !langue || !typeLivre || !categoriesNiveau1 || !publicCible || !niveauLecture || !type) {
      res.status(400);
      throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    let livre;

    // Créer le livre selon son type
    if (type === 'numerique') {
      if (!formatFichier || !fichier) {
        res.status(400);
        throw new Error('Pour un livre numérique, le format et le fichier sont obligatoires');
      }

      livre = new LivreNumerique({
        titre,
        description,
        prix: estGratuit ? 0 : prix,
        estGratuit,
        auteurs,
        editeur: req.user._id,
        langue,
        typeLivre,
        categoriesNiveau1,
        categoriesNiveau2,
        themes,
        publicCible,
        niveauLecture,
        formatFichier,
        fichier
      });
    } else if (type === 'audio') {
      if (!dureeMinutes || !narrateur || !fichierAudio) {
        res.status(400);
        throw new Error('Pour un livre audio, la durée, le narrateur et le fichier audio sont obligatoires');
      }

      livre = new LivreAudio({
        titre,
        description,
        prix: estGratuit ? 0 : prix,
        estGratuit,
        auteurs,
        editeur: req.user._id,
        langue,
        typeLivre,
        categoriesNiveau1,
        categoriesNiveau2,
        themes,
        publicCible,
        niveauLecture,
        dureeMinutes,
        narrateur,
        fichierAudio
      });
    } else {
      res.status(400);
      throw new Error('Type de livre non valide');
    }

    // Vérifier et créer les auteurs si nécessaire
    if (auteurs && auteurs.length > 0) {
      const auteurIds = [];
      
      for (const auteurData of auteurs) {
        // Si c'est un ID, vérifier s'il existe
        if (mongoose.Types.ObjectId.isValid(auteurData)) {
          const auteurExist = await Auteur.findById(auteurData);
          if (auteurExist) {
            auteurIds.push(auteurData);
          }
        } 
        // Si c'est un objet avec nom et prénom, créer ou rechercher
        else if (typeof auteurData === 'object' && auteurData.nom && auteurData.prenom) {
          let auteur = await Auteur.findOne({ 
            nom: auteurData.nom, 
            prenom: auteurData.prenom 
          });
          
          if (!auteur) {
            auteur = await Auteur.create({
              nom: auteurData.nom,
              prenom: auteurData.prenom,
              biographie: auteurData.biographie || ''
            });
          }
          
          auteurIds.push(auteur._id);
        }
      }
      
      livre.auteurs = auteurIds;
    }

    // Enregistrer le livre
    const createdLivre = await livre.save();
    
    res.status(201).json(createdLivre);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Mettre à jour un livre
// @route   PUT /api/livres/:id
// @access  Private (Écrivain, Publicateur)
const updateLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);

    if (!livre) {
      res.status(404);
      throw new Error('Livre non trouvé');
    }

    // Vérifier si l'utilisateur est l'éditeur du livre
    if (livre.editeur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Vous n\'êtes pas autorisé à modifier ce livre');
    }

    // Mettre à jour les champs communs
    livre.titre = req.body.titre || livre.titre;
    livre.description = req.body.description || livre.description;
    
    // Gérer le prix et le statut gratuit
    if (req.body.estGratuit !== undefined) {
      livre.estGratuit = req.body.estGratuit;
      if (livre.estGratuit) {
        livre.prix = 0;
      } else if (req.body.prix !== undefined) {
        livre.prix = req.body.prix;
      }
    } else if (req.body.prix !== undefined) {
      livre.prix = req.body.prix;
    }
    
    // Mettre à jour les références
    if (req.body.auteurs) livre.auteurs = req.body.auteurs;
    if (req.body.langue) livre.langue = req.body.langue;
    if (req.body.typeLivre) livre.typeLivre = req.body.typeLivre;
    if (req.body.categoriesNiveau1) livre.categoriesNiveau1 = req.body.categoriesNiveau1;
    if (req.body.categoriesNiveau2) livre.categoriesNiveau2 = req.body.categoriesNiveau2;
    if (req.body.themes) livre.themes = req.body.themes;
    if (req.body.publicCible) livre.publicCible = req.body.publicCible;
    if (req.body.niveauLecture) livre.niveauLecture = req.body.niveauLecture;
    
    // Mettre à jour les champs spécifiques au type
    if (livre.type === 'numerique') {
      if (req.body.formatFichier) livre.formatFichier = req.body.formatFichier;
      if (req.body.fichier) livre.fichier = req.body.fichier;
    } else if (livre.type === 'audio') {
      if (req.body.dureeMinutes) livre.dureeMinutes = req.body.dureeMinutes;
      if (req.body.narrateur) livre.narrateur = req.body.narrateur;
      if (req.body.fichierAudio) livre.fichierAudio = req.body.fichierAudio;
    }

    const updatedLivre = await livre.save();
    res.json(updatedLivre);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Supprimer un livre
// @route   DELETE /api/livres/:id
// @access  Private (Écrivain, Publicateur, Admin)
const deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);

    if (!livre) {
      res.status(404);
      throw new Error('Livre non trouvé');
    }

    // Vérifier si l'utilisateur est l'éditeur du livre ou un admin
    if (livre.editeur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce livre');
    }

    await livre.remove();
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Changer le statut de publication d'un livre
// @route   PUT /api/livres/:id/publication
// @access  Private (Admin)
const togglePublicationStatus = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);

    if (!livre) {
      res.status(404);
      throw new Error('Livre non trouvé');
    }

    // Seul un admin peut changer le statut de publication
    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Seul un administrateur peut modifier le statut de publication');
    }

    livre.estPublie = !livre.estPublie;
    const updatedLivre = await livre.save();
    
    res.json({
      _id: updatedLivre._id,
      titre: updatedLivre.titre,
      estPublie: updatedLivre.estPublie,
      message: `Le livre "${updatedLivre.titre}" est maintenant ${updatedLivre.estPublie ? 'publié' : 'non publié'}`
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Récupérer les livres d'un éditeur
// @route   GET /api/livres/editeur
// @access  Private
const getLivresByEditeur = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const livres = await Livre.find({ editeur: req.user._id })
      .populate('auteurs', 'nom prenom')
      .populate('langue', 'nom')
      .populate('typeLivre', 'nom')
      .sort({ datePublication: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Livre.countDocuments({ editeur: req.user._id });

    res.json({
      livres,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Récupérer les livres les plus populaires
// @route   GET /api/livres/populaires
// @access  Public
const getLivresPopulaires = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const livres = await Livre.find({ estPublie: true })
      .sort({ popularite: -1, noteUtilisateurs: -1 })
      .limit(limit)
      .populate('auteurs', 'nom prenom')
      .populate('langue', 'nom')
      .populate('typeLivre', 'nom');

    res.json(livres);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Incrémenter le compteur de popularité d'un livre
// @route   PUT /api/livres/:id/popularite
// @access  Public
const incrementerPopularite = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);

    if (!livre) {
      res.status(404);
      throw new Error('Livre non trouvé');
    }

    livre.popularite += 1;
    await livre.save();

    res.json({ message: 'Popularité incrémentée', popularite: livre.popularite });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

module.exports = {
  getLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  togglePublicationStatus,
  getLivresByEditeur,
  getLivresPopulaires,
  incrementerPopularite
};