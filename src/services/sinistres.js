const { Sinistre, Contrat, Vehicule, Assure, User } = require('../models');

function generateReferenceSinistre() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SIN-${year}${month}-${random}`;
}

exports.getAllSinistres = async (req, res) => {
    try {
        const sinistres = await Sinistre.findAll({
            include: [
                { model: Contrat, as: 'contrat' },
                { model: Vehicule, as: 'vehicule' },
                { model: Assure, as: 'assure' },
                { model: User, as: 'createur' }
            ],
            order: [['id_sinistre', 'ASC']]
        });

        return res.status(200).json(sinistres);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des sinistres',
            error: error.message
        });
    }
};

exports.getSinistreById = async (req, res) => {
    try {
        const { id } = req.params;

        const sinistre = await Sinistre.findByPk(id, {
            include: [
                { model: Contrat, as: 'contrat' },
                { model: Vehicule, as: 'vehicule' },
                { model: Assure, as: 'assure' },
                { model: User, as: 'createur' }
            ]
        });

        if (!sinistre) {
            return res.status(404).json({
                message: 'Sinistre introuvable'
            });
        }

        return res.status(200).json(sinistre);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération du sinistre',
            error: error.message
        });
    }
};

exports.createSinistre = async (req, res) => {
    try {
        const {
            id_contrat,
            id_vehicule,
            id_assure,
            nom_conducteur,
            prenom_conducteur,
            conducteur_est_assure,
            date_heure_appel,
            date_heure_sinistre,
            contexte,
            responsabilite_engagee,
            taux_responsabilite,
            statut,
            cree_par
        } = req.body;

        if (
            !id_contrat ||
            !id_vehicule ||
            !id_assure ||
            !nom_conducteur ||
            !prenom_conducteur ||
            conducteur_est_assure === undefined ||
            !date_heure_appel ||
            !date_heure_sinistre ||
            !contexte ||
            responsabilite_engagee === undefined ||
            taux_responsabilite === undefined ||
            !statut ||
            !cree_par
        ) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être renseignés'
            });
        }

        const contrat = await Contrat.findByPk(id_contrat);
        if (!contrat) {
            return res.status(400).json({
                message: 'Contrat invalide'
            });
        }

        const vehicule = await Vehicule.findByPk(id_vehicule);
        if (!vehicule) {
            return res.status(400).json({
                message: 'Véhicule invalide'
            });
        }

        const assure = await Assure.findByPk(id_assure);
        if (!assure) {
            return res.status(400).json({
                message: 'Assuré invalide'
            });
        }

        const createur = await User.findByPk(cree_par);
        if (!createur) {
            return res.status(400).json({
                message: 'Utilisateur créateur invalide'
            });
        }

        let tauxFinal = Number(taux_responsabilite);

        if (responsabilite_engagee === false) {
            tauxFinal = 0;
        }

        if (![0, 50, 100].includes(tauxFinal)) {
            return res.status(400).json({
                message: 'Le taux de responsabilité doit être 0, 50 ou 100'
            });
        }

        const reference_sinistre = generateReferenceSinistre();

        const sinistre = await Sinistre.create({
            reference_sinistre,
            id_contrat,
            id_vehicule,
            id_assure,
            nom_conducteur,
            prenom_conducteur,
            conducteur_est_assure,
            date_heure_appel,
            date_heure_sinistre,
            contexte,
            responsabilite_engagee,
            taux_responsabilite: tauxFinal,
            statut,
            cree_par,
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdSinistre = await Sinistre.findByPk(sinistre.id_sinistre, {
            include: [
                { model: Contrat, as: 'contrat' },
                { model: Vehicule, as: 'vehicule' },
                { model: Assure, as: 'assure' },
                { model: User, as: 'createur' }
            ]
        });

        return res.status(201).json({
            message: 'Sinistre créé avec succès',
            sinistre: createdSinistre
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création du sinistre',
            error: error.message
        });
    }
};

exports.updateSinistre = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_contrat,
            id_vehicule,
            id_assure,
            nom_conducteur,
            prenom_conducteur,
            conducteur_est_assure,
            date_heure_appel,
            date_heure_sinistre,
            contexte,
            responsabilite_engagee,
            taux_responsabilite,
            statut
        } = req.body;

        const sinistre = await Sinistre.findByPk(id);

        if (!sinistre) {
            return res.status(404).json({
                message: 'Sinistre introuvable'
            });
        }

        if (id_contrat !== undefined) {
            const contrat = await Contrat.findByPk(id_contrat);
            if (!contrat) {
                return res.status(400).json({
                    message: 'Contrat invalide'
                });
            }
        }

        if (id_vehicule !== undefined) {
            const vehicule = await Vehicule.findByPk(id_vehicule);
            if (!vehicule) {
                return res.status(400).json({
                    message: 'Véhicule invalide'
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

        let tauxFinal = taux_responsabilite !== undefined
            ? Number(taux_responsabilite)
            : Number(sinistre.taux_responsabilite);

        let responsabiliteFinale = responsabilite_engagee !== undefined
            ? responsabilite_engagee
            : sinistre.responsabilite_engagee;

        if (responsabiliteFinale === false) {
            tauxFinal = 0;
        }

        if (![0, 50, 100].includes(tauxFinal)) {
            return res.status(400).json({
                message: 'Le taux de responsabilité doit être 0, 50 ou 100'
            });
        }

        const updateData = {
            updated_at: new Date(),
            taux_responsabilite: tauxFinal,
            responsabilite_engagee: responsabiliteFinale
        };

        if (id_contrat !== undefined) updateData.id_contrat = id_contrat;
        if (id_vehicule !== undefined) updateData.id_vehicule = id_vehicule;
        if (id_assure !== undefined) updateData.id_assure = id_assure;
        if (nom_conducteur !== undefined) updateData.nom_conducteur = nom_conducteur;
        if (prenom_conducteur !== undefined) updateData.prenom_conducteur = prenom_conducteur;
        if (conducteur_est_assure !== undefined) updateData.conducteur_est_assure = conducteur_est_assure;
        if (date_heure_appel !== undefined) updateData.date_heure_appel = date_heure_appel;
        if (date_heure_sinistre !== undefined) updateData.date_heure_sinistre = date_heure_sinistre;
        if (contexte !== undefined) updateData.contexte = contexte;
        if (statut !== undefined) updateData.statut = statut;

        await sinistre.update(updateData);

        const updatedSinistre = await Sinistre.findByPk(id, {
            include: [
                { model: Contrat, as: 'contrat' },
                { model: Vehicule, as: 'vehicule' },
                { model: Assure, as: 'assure' },
                { model: User, as: 'createur' }
            ]
        });

        return res.status(200).json({
            message: 'Sinistre modifié avec succès',
            sinistre: updatedSinistre
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du sinistre',
            error: error.message
        });
    }
};