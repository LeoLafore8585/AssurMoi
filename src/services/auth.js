const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, SecuriteUtilisateur, Role } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                message: 'Email et mot de passe requis'
            });
        }

        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            return res.status(401).json({
                message: 'Identifiants invalides'
            });
        }

        if (!user.actif) {
            return res.status(403).json({
                message: 'Compte inactif'
            });
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Identifiants invalides'
            });
        }

        // Pour l’instant on simule le 2FA avec un code simple
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await SecuriteUtilisateur.create({
            id_utilisateur: user.id_utilisateur,
            type_securite: '2FA',
            token_code: code,
            canal: 'EMAIL',
            expire_at: new Date(Date.now() + 10 * 60 * 1000), // 10 min
            created_at: new Date()
        });

        return res.status(200).json({
            message: 'Code 2FA généré',
            requires_2fa: true,
            user_id: user.id_utilisateur,
            code_demo: code
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

exports.verify2FA = async (req, res) => {
    try {
        const { user_id, code } = req.body;

        if (!user_id || !code) {
            return res.status(400).json({
                message: 'user_id et code requis'
            });
        }

        const record = await SecuriteUtilisateur.findOne({
            where: {
                id_utilisateur: user_id,
                type_securite: '2FA',
                token_code: code,
                used_at: null
            },
            order: [['created_at', 'DESC']]
        });

        if (!record) {
            return res.status(400).json({
                message: 'Code 2FA invalide'
            });
        }

        if (new Date(record.expire_at) < new Date()) {
            return res.status(400).json({
                message: 'Code 2FA expiré'
            });
        }

        await record.update({
            used_at: new Date()
        });

        const user = await User.findByPk(user_id, {
            include: [{ model: Role, as: 'role' }]
        });

        const token = jwt.sign(
            {
                id_utilisateur: user.id_utilisateur,
                email: user.email,
                role: user.role ? user.role.libelle : null
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: 'Authentification réussie',
            token,
            user: {
                id_utilisateur: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role ? user.role.libelle : null
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

exports.me = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Token manquant'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findByPk(decoded.id_utilisateur, {
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        return res.status(200).json({
            id_utilisateur: user.id_utilisateur,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            actif: user.actif,
            role: user.role ? user.role.libelle : null
        });
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalide ou expiré'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email requis'
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        const token = Math.random().toString(36).substring(2) + Date.now();

        await SecuriteUtilisateur.create({
            id_utilisateur: user.id_utilisateur,
            type_securite: 'RESET_PASSWORD',
            token_code: token,
            canal: 'EMAIL',
            expire_at: new Date(Date.now() + 30 * 60 * 1000), // 30 min
            created_at: new Date()
        });

        return res.status(200).json({
            message: 'Token de réinitialisation généré',
            token_demo: token
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, nouveau_mot_de_passe } = req.body;

        if (!token || !nouveau_mot_de_passe) {
            return res.status(400).json({
                message: 'Token et nouveau mot de passe requis'
            });
        }

        const record = await SecuriteUtilisateur.findOne({
            where: {
                token_code: token,
                type_securite: 'RESET_PASSWORD',
                used_at: null
            },
            order: [['created_at', 'DESC']]
        });

        if (!record) {
            return res.status(400).json({
                message: 'Token invalide'
            });
        }

        if (new Date(record.expire_at) < new Date()) {
            return res.status(400).json({
                message: 'Token expiré'
            });
        }

        const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);

        const user = await User.findByPk(record.id_utilisateur);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        await user.update({
            mot_de_passe_hash: hashedPassword
        });

        await record.update({
            used_at: new Date()
        });

        return res.status(200).json({
            message: 'Mot de passe réinitialisé avec succès'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};