const { Vehicule, Assure } = require('../models');

exports.getAllVehicules = async (req, res) => {
    try {
        const vehicules = await Vehicule.findAll({
            include: [{ model: Assure, as: 'assure' }],
            order: [['id_vehicule', 'ASC']]
        });

        return res.status(200).json(vehicules);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des véhicules',
            error: error.message
        });
    }
};

exports.getVehiculeById = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicule = await Vehicule.findByPk(id, {
            include: [{ model: Assure, as: 'assure' }]
        });

        if (!vehicule) {
            return res.status(404).json({
                message: 'Véhicule introuvable'
            });
        }

        return res.status(200).json(vehicule);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération du véhicule',
            error: error.message
        });
    }
};

exports.createVehicule = async (req, res) => {
    try {
        const {
            id_assure,
            immatriculation,
            marque,
            modele,
            annee,
            valeur_argus
        } = req.body;

        if (!id_assure || !immatriculation || !marque || !modele) {
            return res.status(400).json({
                message: 'id_assure, immatriculation, marque et modele sont requis'
            });
        }

        const assure = await Assure.findByPk(id_assure);
        if (!assure) {
            return res.status(400).json({
                message: 'Assuré invalide'
            });
        }

        const existingVehicule = await Vehicule.findOne({
            where: { immatriculation }
        });

        if (existingVehicule) {
            return res.status(409).json({
                message: 'Un véhicule avec cette immatriculation existe déjà'
            });
        }

        const vehicule = await Vehicule.create({
            id_assure,
            immatriculation,
            marque,
            modele,
            annee: annee ?? null,
            valeur_argus: valeur_argus ?? null,
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdVehicule = await Vehicule.findByPk(vehicule.id_vehicule, {
            include: [{ model: Assure, as: 'assure' }]
        });

        return res.status(201).json({
            message: 'Véhicule créé avec succès',
            vehicule: createdVehicule
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création du véhicule',
            error: error.message
        });
    }
};

exports.updateVehicule = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_assure,
            immatriculation,
            marque,
            modele,
            annee,
            valeur_argus
        } = req.body;

        const vehicule = await Vehicule.findByPk(id);

        if (!vehicule) {
            return res.status(404).json({
                message: 'Véhicule introuvable'
            });
        }

        if (id_assure !== undefined) {
            const assure = await Assure.findByPk(id_assure);
            if (!assure) {
                return res.status(400).json({
                    message: 'Assuré invalide'
                });
            }
        }

        if (immatriculation && immatriculation !== vehicule.immatriculation) {
            const existingVehicule = await Vehicule.findOne({
                where: { immatriculation }
            });

            if (existingVehicule) {
                return res.status(409).json({
                    message: 'Un véhicule avec cette immatriculation existe déjà'
                });
            }
        }

        const updateData = {
            updated_at: new Date()
        };

        if (id_assure !== undefined) updateData.id_assure = id_assure;
        if (immatriculation !== undefined) updateData.immatriculation = immatriculation;
        if (marque !== undefined) updateData.marque = marque;
        if (modele !== undefined) updateData.modele = modele;
        if (annee !== undefined) updateData.annee = annee;
        if (valeur_argus !== undefined) updateData.valeur_argus = valeur_argus;

        await vehicule.update(updateData);

        const updatedVehicule = await Vehicule.findByPk(id, {
            include: [{ model: Assure, as: 'assure' }]
        });

        return res.status(200).json({
            message: 'Véhicule modifié avec succès',
            vehicule: updatedVehicule
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du véhicule',
            error: error.message
        });
    }
};