module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id_utilisateur: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mot_de_passe_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        actif: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'utilisateurs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: 'id_role',
            as: 'role'
        });

        User.hasMany(models.Sinistre, {
            foreignKey: 'cree_par',
            as: 'sinistres_crees'
        });

        User.hasMany(models.Dossier, {
            foreignKey: 'id_charge_suivi',
            as: 'dossiers_suivis'
        });

        User.hasMany(models.Dossier, {
            foreignKey: 'id_gestionnaire',
            as: 'dossiers_geres'
        });

        User.hasMany(models.Document, {
            foreignKey: 'valide_par',
            as: 'documents_valides'
        });
    };

    return User;
};