const { Dossier, Sinistre, User, Contrat, Vehicule, Assure } = require('../models');

function generateNumeroDossier() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `DOS-${year}${month}-${random}`;
}

exports.getAllDossiers = async (req, res) => {
    try {
        const dossiers = await Dossier.findAll({
            include: [
                {
                    model: Sinistre,
                    as: 'sinistre',
                    include: [
                        { model: Contrat, as: 'contrat' },
                        { model: Vehicule, as: 'vehicule' },
                        { model: Assure, as: 'assure' }
                    ]
                },
                { model: User, as: 'charge_suivi' },
                { model: User, as: 'gestionnaire' }
            ],
            order: [['id_dossier', 'ASC']]
        });

        return res.status(200).json(dossiers);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des dossiers',
            error: error.message
        });
    }
};

exports.getDossierById = async (req, res) => {
    try {
        const { id } = req.params;

        const dossier = await Dossier.findByPk(id, {
            include: [
                {
                    model: Sinistre,
                    as: 'sinistre',
                    include: [
                        { model: Contrat, as: 'contrat' },
                        { model: Vehicule, as: 'vehicule' },
                        { model: Assure, as: 'assure' }
                    ]
                },
                { model: User, as: 'charge_suivi' },
                { model: User, as: 'gestionnaire' }
            ]
        });

        if (!dossier) {
            return res.status(404).json({
                message: 'Dossier introuvable'
            });
        }

        return res.status(200).json(dossier);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération du dossier',
            error: error.message
        });
    }
};

exports.createDossier = async (req, res) => {
    try {
        const {
            id_sinistre,
            scenario,
            statut,
            id_charge_suivi,
            id_gestionnaire,
            date_ouverture
        } = req.body;

        if (!id_sinistre) {
            return res.status(400).json({
                message: 'id_sinistre est requis'
            });
        }

        const sinistre = await Sinistre.findByPk(id_sinistre);

        if (!sinistre) {
            return res.status(400).json({
                message: 'Sinistre invalide'
            });
        }

        const existingDossier = await Dossier.findOne({
            where: { id_sinistre }
        });

        if (existingDossier) {
            return res.status(409).json({
                message: 'Un dossier existe déjà pour ce sinistre'
            });
        }

        if (id_charge_suivi !== undefined && id_charge_suivi !== null) {
            const chargeSuivi = await User.findByPk(id_charge_suivi);
            if (!chargeSuivi) {
                return res.status(400).json({
                    message: 'Chargé de suivi invalide'
                });
            }
        }

        if (id_gestionnaire !== undefined && id_gestionnaire !== null) {
            const gestionnaire = await User.findByPk(id_gestionnaire);
            if (!gestionnaire) {
                return res.status(400).json({
                    message: 'Gestionnaire invalide'
                });
            }
        }

        const numero_dossier = generateNumeroDossier();

        const dossier = await Dossier.create({
            numero_dossier,
            id_sinistre,
            scenario: scenario || null,
            statut: statut || 'DOSSIER_INITIALISE',
            id_charge_suivi: id_charge_suivi || null,
            id_gestionnaire: id_gestionnaire || null,
            date_ouverture: date_ouverture || new Date(),
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdDossier = await Dossier.findByPk(dossier.id_dossier, {
            include: [
                {
                    model: Sinistre,
                    as: 'sinistre',
                    include: [
                        { model: Contrat, as: 'contrat' },
                        { model: Vehicule, as: 'vehicule' },
                        { model: Assure, as: 'assure' }
                    ]
                },
                { model: User, as: 'charge_suivi' },
                { model: User, as: 'gestionnaire' }
            ]
        });

        return res.status(201).json({
            message: 'Dossier créé avec succès',
            dossier: createdDossier
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création du dossier',
            error: error.message
        });
    }
};

exports.updateDossier = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            scenario,
            statut,
            id_charge_suivi,
            id_gestionnaire,
            date_ouverture,
            date_cloture,
            commentaire_cloture
        } = req.body;

        const dossier = await Dossier.findByPk(id);

        if (!dossier) {
            return res.status(404).json({
                message: 'Dossier introuvable'
            });
        }

        if (id_charge_suivi !== undefined && id_charge_suivi !== null) {
            const chargeSuivi = await User.findByPk(id_charge_suivi);
            if (!chargeSuivi) {
                return res.status(400).json({
                    message: 'Chargé de suivi invalide'
                });
            }
        }

        if (id_gestionnaire !== undefined && id_gestionnaire !== null) {
            const gestionnaire = await User.findByPk(id_gestionnaire);
            if (!gestionnaire) {
                return res.status(400).json({
                    message: 'Gestionnaire invalide'
                });
            }
        }

        const updateData = {
            updated_at: new Date()
        };

        if (scenario !== undefined) updateData.scenario = scenario;
        if (statut !== undefined) updateData.statut = statut;
        if (id_charge_suivi !== undefined) updateData.id_charge_suivi = id_charge_suivi;
        if (id_gestionnaire !== undefined) updateData.id_gestionnaire = id_gestionnaire;
        if (date_ouverture !== undefined) updateData.date_ouverture = date_ouverture;
        if (date_cloture !== undefined) updateData.date_cloture = date_cloture;
        if (commentaire_cloture !== undefined) updateData.commentaire_cloture = commentaire_cloture;

        await dossier.update(updateData);

        const updatedDossier = await Dossier.findByPk(id, {
            include: [
                {
                    model: Sinistre,
                    as: 'sinistre',
                    include: [
                        { model: Contrat, as: 'contrat' },
                        { model: Vehicule, as: 'vehicule' },
                        { model: Assure, as: 'assure' }
                    ]
                },
                { model: User, as: 'charge_suivi' },
                { model: User, as: 'gestionnaire' }
            ]
        });

        return res.status(200).json({
            message: 'Dossier modifié avec succès',
            dossier: updatedDossier
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du dossier',
            error: error.message
        });
    }
};

exports.updateDossierStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, date_cloture, commentaire_cloture } = req.body;

        if (!statut) {
            return res.status(400).json({
                message: 'Le statut est requis'
            });
        }

        const dossier = await Dossier.findByPk(id);

        if (!dossier) {
            return res.status(404).json({
                message: 'Dossier introuvable'
            });
        }

        const updateData = {
            statut,
            updated_at: new Date()
        };

        if (date_cloture !== undefined) updateData.date_cloture = date_cloture;
        if (commentaire_cloture !== undefined) updateData.commentaire_cloture = commentaire_cloture;

        await dossier.update(updateData);

        const updatedDossier = await Dossier.findByPk(id, {
            include: [
                {
                    model: Sinistre,
                    as: 'sinistre',
                    include: [
                        { model: Contrat, as: 'contrat' },
                        { model: Vehicule, as: 'vehicule' },
                        { model: Assure, as: 'assure' }
                    ]
                },
                { model: User, as: 'charge_suivi' },
                { model: User, as: 'gestionnaire' }
            ]
        });

        return res.status(200).json({
            message: 'Statut du dossier mis à jour avec succès',
            dossier: updatedDossier
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la mise à jour du statut du dossier',
            error: error.message
        });
    }
};