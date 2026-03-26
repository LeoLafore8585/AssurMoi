module.exports = (sequelize, DataTypes) => {
    const Assure = sequelize.define('Assure', {
        id_assure: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            allowNull: false
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code_postal: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ville: {
            type: DataTypes.STRING,
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
        tableName: 'assures',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Assure.associate = (models) => {
        Assure.belongsTo(models.User, {
            foreignKey: 'id_utilisateur',
            as: 'utilisateur'
        });

        Assure.hasMany(models.Contrat, {
            foreignKey: 'id_assure',
            as: 'contrats'
        });

        Assure.hasMany(models.Vehicule, {
            foreignKey: 'id_assure',
            as: 'vehicules'
        });

        Assure.hasMany(models.Sinistre, {
            foreignKey: 'id_assure',
            as: 'sinistres'
        });
    };

    return Assure;
};