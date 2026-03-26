module.exports = (sequelize, DataTypes) => {
    const Dossier = sequelize.define('Dossier', {
        id_dossier: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero_dossier: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        id_sinistre: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        scenario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        statut: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_charge_suivi: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_gestionnaire: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        date_ouverture: {
            type: DataTypes.DATE,
            allowNull: true
        },
        date_cloture: {
            type: DataTypes.DATE,
            allowNull: true
        },
        commentaire_cloture: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'dossiers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Dossier.associate = (models) => {
        Dossier.belongsTo(models.Sinistre, {
            foreignKey: 'id_sinistre',
            as: 'sinistre'
        });

        Dossier.belongsTo(models.User, {
            foreignKey: 'id_charge_suivi',
            as: 'charge_suivi'
        });

        Dossier.belongsTo(models.User, {
            foreignKey: 'id_gestionnaire',
            as: 'gestionnaire'
        });

        Dossier.hasMany(models.Document, {
            foreignKey: 'id_dossier',
            as: 'documents'
        });
    };

    return Dossier;
};