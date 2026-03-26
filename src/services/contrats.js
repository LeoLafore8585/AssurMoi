const { Contrat, Assure } = require('../models');

exports.getAllContrats = async (req, res) => {
    try {
        const contrats = await Contrat.findAll({
            include: [{ model: Assure, as: 'assure' }],
            order: [['id_contrat', 'ASC']]
        });

        return res.status(200).json(contrats);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des contrats',
            error: error.message
        });
    }
};

exports.getContratById = async (req, res) => {
    try {
        const { id } = req.params;

        const contrat = await Contrat.findByPk(id, {
            include: [{ model: Assure, as: 'assure' }]
        });

        if (!contrat) {
            return res.status(404).json({
                message: 'Contrat introuvable'
            });
        }

        return res.status(200).json(contrat);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération du contrat',
            error: error.message
        });
    }
};

exports.createContrat = async (req, res) => {
    try {
        const {
            reference_contrat,
            id_assure,
            type_contrat,
            franchise,
            date_debut,
            date_fin,
            actif
        } = req.body;

        if (!reference_contrat || !id_assure || !type_contrat) {
            return res.status(400).json({
                message: 'reference_contrat, id_assure et type_contrat sont requis'
            });
        }

        const existingContrat = await Contrat.findOne({
            where: { reference_contrat }
        });

        if (existingContrat) {
            return res.status(409).json({
                message: 'Un contrat avec cette référence existe déjà'
            });
        }

        const assure = await Assure.findByPk(id_assure);

        if (!assure) {
            return res.status(400).json({
                message: 'Assuré invalide'
            });
        }

        const contrat = await Contrat.create({
            reference_contrat,
            id_assure,
            type_contrat,
            franchise: franchise ?? null,
            date_debut: date_debut || null,
            date_fin: date_fin || null,
            actif: typeof actif === 'boolean' ? actif : true,
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdContrat = await Contrat.findByPk(contrat.id_contrat, {
            include: [{ model: Assure, as: 'assure' }]
        });

        return res.status(201).json({
            message: 'Contrat créé avec succès',
            contrat: createdContrat
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création du contrat',
            error: error.message
        });
    }
};

exports.updateContrat = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            reference_contrat,
            id_assure,
            type_contrat,
            franchise,
            date_debut,
            date_fin,
            actif
        } = req.body;

        const contrat = await Contrat.findByPk(id);

        if (!contrat) {
            return res.status(404).json({
                message: 'Contrat introuvable'
            });
        }

        if (reference_contrat && reference_contrat !== contrat.reference_contrat) {
            const existingContrat = await Contrat.findOne({
                where: { reference_contrat }
            });

            if (existingContrat) {
                return res.status(409).json({
                    message: 'Un contrat avec cette référence existe déjà'
                });
            }
        }

        if (id_assure !== undefined) {
            const assure = await Assure.findByPk(id_assure);

            if (!assure) {
                return res.status(400).json({
                    message: 'Assuré invalide'
                });
            }
        }

        const updateData = {
            updated_at: new Date()
        };

        if (reference_contrat !== undefined) updateData.reference_contrat = reference_contrat;
        if (id_assure !== undefined) updateData.id_assure = id_assure;
        if (type_contrat !== undefined) updateData.type_contrat = type_contrat;
        if (franchise !== undefined) updateData.franchise = franchise;
        if (date_debut !== undefined) updateData.date_debut = date_debut;
        if (date_fin !== undefined) updateData.date_fin = date_fin;
        if (actif !== undefined) updateData.actif = actif;

        await contrat.update(updateData);

        const updatedContrat = await Contrat.findByPk(id, {
            include: [{ model: Assure, as: 'assure' }]
        });

        return res.status(200).json({
            message: 'Contrat modifié avec succès',
            contrat: updatedContrat
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du contrat',
            error: error.message
        });
    }
};