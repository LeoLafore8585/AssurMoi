const { Document, Sinistre, Dossier, User } = require('../models');

exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.findAll({
            include: [
                { model: Sinistre, as: 'sinistre' },
                { model: Dossier, as: 'dossier' },
                { model: User, as: 'validateur' }
            ],
            order: [['id_document', 'ASC']]
        });

        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des documents',
            error: error.message
        });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findByPk(id, {
            include: [
                { model: Sinistre, as: 'sinistre' },
                { model: Dossier, as: 'dossier' },
                { model: User, as: 'validateur' }
            ]
        });

        if (!document) {
            return res.status(404).json({
                message: 'Document introuvable'
            });
        }

        return res.status(200).json(document);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération du document',
            error: error.message
        });
    }
};

exports.createDocument = async (req, res) => {
    try {
        const {
            id_sinistre,
            id_dossier,
            type_document,
            nom_fichier,
            chemin_fichier,
            statut_validation,
            valide_par,
            date_validation
        } = req.body;

        if (!type_document || !nom_fichier || !chemin_fichier) {
            return res.status(400).json({
                message: 'type_document, nom_fichier et chemin_fichier sont requis'
            });
        }

        if (!id_sinistre && !id_dossier) {
            return res.status(400).json({
                message: 'Le document doit être lié à un sinistre ou à un dossier'
            });
        }

        if (id_sinistre) {
            const sinistre = await Sinistre.findByPk(id_sinistre);
            if (!sinistre) {
                return res.status(400).json({
                    message: 'Sinistre invalide'
                });
            }
        }

        if (id_dossier) {
            const dossier = await Dossier.findByPk(id_dossier);
            if (!dossier) {
                return res.status(400).json({
                    message: 'Dossier invalide'
                });
            }
        }

        if (valide_par) {
            const validateur = await User.findByPk(valide_par);
            if (!validateur) {
                return res.status(400).json({
                    message: 'Validateur invalide'
                });
            }
        }

        const document = await Document.create({
            id_sinistre: id_sinistre || null,
            id_dossier: id_dossier || null,
            type_document,
            nom_fichier,
            chemin_fichier,
            statut_validation: statut_validation || 'EN_ATTENTE',
            valide_par: valide_par || null,
            date_validation: date_validation || null,
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdDocument = await Document.findByPk(document.id_document, {
            include: [
                { model: Sinistre, as: 'sinistre' },
                { model: Dossier, as: 'dossier' },
                { model: User, as: 'validateur' }
            ]
        });

        return res.status(201).json({
            message: 'Document créé avec succès',
            document: createdDocument
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création du document',
            error: error.message
        });
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            type_document,
            nom_fichier,
            chemin_fichier,
            statut_validation,
            valide_par,
            date_validation
        } = req.body;

        const document = await Document.findByPk(id);

        if (!document) {
            return res.status(404).json({
                message: 'Document introuvable'
            });
        }

        if (valide_par !== undefined && valide_par !== null) {
            const validateur = await User.findByPk(valide_par);
            if (!validateur) {
                return res.status(400).json({
                    message: 'Validateur invalide'
                });
            }
        }

        const updateData = {
            updated_at: new Date()
        };

        if (type_document !== undefined) updateData.type_document = type_document;
        if (nom_fichier !== undefined) updateData.nom_fichier = nom_fichier;
        if (chemin_fichier !== undefined) updateData.chemin_fichier = chemin_fichier;
        if (statut_validation !== undefined) updateData.statut_validation = statut_validation;
        if (valide_par !== undefined) updateData.valide_par = valide_par;
        if (date_validation !== undefined) updateData.date_validation = date_validation;

        await document.update(updateData);

        const updatedDocument = await Document.findByPk(id, {
            include: [
                { model: Sinistre, as: 'sinistre' },
                { model: Dossier, as: 'dossier' },
                { model: User, as: 'validateur' }
            ]
        });

        return res.status(200).json({
            message: 'Document modifié avec succès',
            document: updatedDocument
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du document',
            error: error.message
        });
    }
};