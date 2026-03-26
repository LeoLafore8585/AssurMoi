module.exports = (sequelize, DataTypes) => {
    const Sinistre = sequelize.define('Sinistre', {
        id_sinistre: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reference_sinistre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        id_contrat: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_vehicule: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_assure: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nom_conducteur: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prenom_conducteur: {
            type: DataTypes.STRING,
            allowNull: false
        },
        conducteur_est_assure: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        date_heure_appel: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_heure_sinistre: {
            type: DataTypes.DATE,
            allowNull: false
        },
        contexte: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        responsabilite_engagee: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        taux_responsabilite: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        statut: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cree_par: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        tableName: 'sinistres',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Sinistre.associate = (models) => {
        Sinistre.belongsTo(models.Contrat, {
            foreignKey: 'id_contrat',
            as: 'contrat'
        });

        Sinistre.belongsTo(models.Vehicule, {
            foreignKey: 'id_vehicule',
            as: 'vehicule'
        });

        Sinistre.belongsTo(models.Assure, {
            foreignKey: 'id_assure',
            as: 'assure'
        });

        Sinistre.belongsTo(models.User, {
            foreignKey: 'cree_par',
            as: 'createur'
        });

        Sinistre.hasOne(models.Dossier, {
            foreignKey: 'id_sinistre',
            as: 'dossier'
        });

        Sinistre.hasMany(models.Document, {
            foreignKey: 'id_sinistre',
            as: 'documents'
        });
    };

    return Sinistre;
};