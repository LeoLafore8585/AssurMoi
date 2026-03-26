const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Role, as: 'role' }],
            order: [['id_utilisateur', 'ASC']]
        });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération de l’utilisateur',
            error: error.message
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            id_role,
            actif
        } = req.body;

        if (!nom || !prenom || !email || !mot_de_passe || !id_role) {
            return res.status(400).json({
                message: 'nom, prenom, email, mot_de_passe et id_role sont requis'
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        const role = await Role.findByPk(id_role);

        if (!role) {
            return res.status(400).json({
                message: 'Rôle invalide'
            });
        }

        const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

        const user = await User.create({
            nom,
            prenom,
            email,
            telephone: telephone || null,
            mot_de_passe_hash,
            id_role,
            actif: typeof actif === 'boolean' ? actif : true,
            created_at: new Date(),
            updated_at: new Date()
        });

        const createdUser = await User.findByPk(user.id_utilisateur, {
            include: [{ model: Role, as: 'role' }]
        });

        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: createdUser
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la création de l’utilisateur',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            id_role,
            actif
        } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                where: { email }
            });

            if (existingUser) {
                return res.status(409).json({
                    message: 'Un utilisateur avec cet email existe déjà'
                });
            }
        }

        if (id_role) {
            const role = await Role.findByPk(id_role);

            if (!role) {
                return res.status(400).json({
                    message: 'Rôle invalide'
                });
            }
        }

        const updateData = {
            updated_at: new Date()
        };

        if (nom !== undefined) updateData.nom = nom;
        if (prenom !== undefined) updateData.prenom = prenom;
        if (email !== undefined) updateData.email = email;
        if (telephone !== undefined) updateData.telephone = telephone;
        if (id_role !== undefined) updateData.id_role = id_role;
        if (actif !== undefined) updateData.actif = actif;

        if (mot_de_passe) {
            updateData.mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);
        }

        await user.update(updateData);

        const updatedUser = await User.findByPk(id, {
            include: [{ model: Role, as: 'role' }]
        });

        return res.status(200).json({
            message: 'Utilisateur modifié avec succès',
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification de l’utilisateur',
            error: error.message
        });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { actif } = req.body;

        if (typeof actif !== 'boolean') {
            return res.status(400).json({
                message: 'Le champ actif doit être un booléen'
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        await user.update({
            actif,
            updated_at: new Date()
        });

        return res.status(200).json({
            message: `Utilisateur ${actif ? 'activé' : 'désactivé'} avec succès`,
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};