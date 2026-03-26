module.exports = (rolesAutorises = []) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: 'Non authentifié'
                });
            }

            if (!rolesAutorises.includes(user.role)) {
                return res.status(403).json({
                    message: 'Accès refusé'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur middleware rôle',
                error: error.message
            });
        }
    };
};