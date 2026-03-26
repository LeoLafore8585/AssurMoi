const { Assure, User } = require('../models');

exports.getAllAssures = async (req, res) => {
    try {
        const assures = await Assure.findAll({
            include: [{ model: User, as: 'utilisateur' }],
            order: [['id_assure', 'ASC']]
        });

        return res.status(200).json(assures);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des assurés',
            error: error.message
        });
    }
};

exports.getAssureById = async (req, res) => {
    try {
        const { id } = req.params;

        const assure = await Assure.findByPk(id, {
            include: [{ model: User, as: 'utilisateur' }]
        });

        if (!assure) {
            return res.status(404).json({
                message: 'Assuré introuvable'
            });
        }

        return res.status(200).json(assure);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération de l’assuré',
            error: error.message
        });
    }
};

exports.createAssure = async (req, res) => {
    try {
        const {
            id_utilisateur,
            nom,
            prenom,
            email,
            telephone,
            adresse,
            code_postal,
            ville
        } = req.body;

        if (!nom || !prenom || !email || !telephone) {
            return res.status(400).json({
                message: 'nom, prenom, email et telephone sont requis'
            });
        }

        if (id_utilisateur) {
            const user = await User.findByPk(id_utilisateur);
            if (!user) {
                return res.status(400).json({
                    message: 'Utilisateur lié invalide'
                });
            }
        }

        const assure = await Assure.create({
            id_utilisateur: id_utilisateur || null,
            nom,
            prenom,
            email,
            telephone,
            adresse: adresse || null,
            code_postal: code_postal || null,
            ville: ville || null,
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdAssure = await Assure.findByPk(assure.id_assure, {
            include: [{ model: User, as: 'utilisateur' }]
        });

        return res.status(201).json({
            message: 'Assuré créé avec succès',
            assure: createdAssure
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création de l’assuré',
            error: error.message
        });
    }
};

exports.updateAssure = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_utilisateur,
            nom,
            prenom,
            email,
            telephone,
            adresse,
            code_postal,
            ville
        } = req.body;

        const assure = await Assure.findByPk(id);

        if (!assure) {
            return res.status(404).json({
                message: 'Assuré introuvable'
            });
        }

        if (id_utilisateur !== undefined && id_utilisateur !== null) {
            const user = await User.findByPk(id_utilisateur);
            if (!user) {
                return res.status(400).json({
                    message: 'Utilisateur lié invalide'
                });
            }
        }

        const updateData = {
            updated_at: new Date()
        };

        if (id_utilisateur !== undefined) updateData.id_utilisateur = id_utilisateur;
        if (nom !== undefined) updateData.nom = nom;
        if (prenom !== undefined) updateData.prenom = prenom;
        if (email !== undefined) updateData.email = email;
        if (telephone !== undefined) updateData.telephone = telephone;
        if (adresse !== undefined) updateData.adresse = adresse;
        if (code_postal !== undefined) updateData.code_postal = code_postal;
        if (ville !== undefined) updateData.ville = ville;

        await assure.update(updateData);

        const updatedAssure = await Assure.findByPk(id, {
            include: [{ model: User, as: 'utilisateur' }]
        });

        return res.status(200).json({
            message: 'Assuré modifié avec succès',
            assure: updatedAssure
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification de l’assuré',
            error: error.message
        });
    }
};