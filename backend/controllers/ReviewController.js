const { Commentaire, Avis } = require('../models/commentaireModel');
const { Livre } = require('../models/livreModel');

// @desc    Créer un nouveau commentaire
// @route   POST /api/livres/:id/commentaires
// @access  Private
const creerCommentaire = async (req, res) => {
  try {
    const { contenu } = req.body;
    const livreId = req.params.id;

    // Vérifier si le livre existe
    const livre = await Livre.findById(livreId);
    
    if (!livre) {
      res.status(404);
      throw new Error('Livre non trouvé');
    }

    // Créer le commentaire
    const commentaire = await Commentaire.create({
      contenu,
      utilisateur: req.user._id,
      livre: livreId
    });

    // Obtenir les détails complets du commentaire avec les informations de l'utilisateur
    const commentaireComplet = await Commentaire.findById(commentaire._id)
      .populate('utilisateur', 'nom prenom');

    res.status(201).json(commentaireComplet);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Obtenir tous les commentaires d'un livre
// @route   GET /api/livres/:id/commentaires
// @access  Public
const getCommentairesByLivre = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const commentaires = await Commentaire.find({ livre: req.params.id })
      .populate('utilisateur', 'nom prenom')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Commentaire.countDocuments({ livre: req.params.id });

    res.json({
      commentaires,
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

// @desc    Mettre à jour un commentaire
// @route   PUT /api/commentaires/:id
// @access  Private
const updateCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findById(req.params.id);

    if (!commentaire) {
      res.status(404);
      throw new Error('Commentaire non trouvé');
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (commentaire.utilisateur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Vous n\'êtes pas autorisé à modifier ce commentaire');
    }

    commentaire.contenu = req.body.contenu || commentaire.contenu;
    const updatedCommentaire = await commentaire.save();

    res.json(updatedCommentaire);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Supprimer un commentaire
// @route   DELETE /api/commentaires/:id
// @access  Private
const deleteCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findById(req.params.id);

    if (!commentaire) {
      res.status(404);
      throw new Error('Commentaire non trouvé');
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire ou un admin
    if (commentaire.utilisateur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce commentaire');
    }

    await commentaire.remove();
    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Créer ou mettre à jour une note (avis)
// @route   POST /api/livres/:id/avis
// @access  Private
const creerMettreAJourAvis = async (req, res) => {
  try {
    const { note } = req.body;
    const livreId = req.params.id;

    if (!note || note < 1 || note > 5) {
      res.status(400);
      throw new Error('La note doit être comprise entre 1 et 5');
    }

    // Vérifier si le livre existe
    const livre = await Livre.findById(livreId);
    
    if (!livre) {
      res.status(404);
      throw new Error('Livre non trouvé');
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    let avis = await Avis.findOne({
      utilisateur: req.user._id,
      livre: livreId
    });

    if (avis) {
      // Mettre à jour l'avis existant
      avis.note = note;
      await avis.save();
    } else {
      // Créer un nouvel avis
      avis = await Avis.create({
        note,
        utilisateur: req.user._id,
        livre: livreId
      });
    }

    // Recalculer la note moyenne
    await livre.calculerNoteMoyenne();

    // Obtenir les détails complets de l'avis avec l'utilisateur et le livre mis à jour
    const avisComplet = await Avis.findById(avis._id)
      .populate('utilisateur', 'nom prenom');

    res.status(avis.createdAt === avis.updatedAt ? 201 : 200).json({
      avis: avisComplet,
      noteUtilisateurs: livre.noteUtilisateurs,
      nombreAvis: livre.nombreAvis
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};

// @desc    Obtenir tous les avis d'un livre
// @route   GET /api/livres/:id/avis
// @access  Public
const getAvisByLivre = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const avis = await Avis.find({ livre: req.params.id })
      .populate('utilisateur', 'nom prenom')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Avis.countDocuments({ livre: req.params.id });

    res.json({
      avis,
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

// @desc    Obtenir l'avis d'un utilisateur spécifique pour un livre
// @route   GET /api/livres/:id/avis/mon-avis
// @access  Private
const getMonAvisParLivre = async (req, res) => {
  try {
    const avis = await Avis.findOne({
      livre: req.params.id,
      utilisateur: req.user._id
    });

    if (avis) {
      res.json(avis);
    } else {
      res.status(404).json({ message: 'Vous n\'avez pas encore noté ce livre' });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Supprimer un avis
// @route   DELETE /api/avis/:id
// @access  Private
const deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);

    if (!avis) {
      res.status(404);
      throw new Error('Avis non trouvé');
    }

    // Vérifier si l'utilisateur est l'auteur de l'avis ou un admin
    if (avis.utilisateur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Vous n\'êtes pas autorisé à supprimer cet avis');
    }

    const livreId = avis.livre;
    
    await avis.remove();
    
    // Recalculer la note moyenne du livre
    const livre = await Livre.findById(livreId);
    if (livre) {
      await livre.calculerNoteMoyenne();
    }

    res.json({ 
      message: 'Avis supprimé',
      noteUtilisateurs: livre ? livre.noteUtilisateurs : 0,
      nombreAvis: livre ? livre.nombreAvis : 0
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message
    });
  }
};