module.exports = (sequelize, DataTypes) => {
    const Vehicule = sequelize.define('Vehicule', {
        id_vehicule: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_assure: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        immatriculation: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        marque: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modele: {
            type: DataTypes.STRING,
            allowNull: false
        },
        annee: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        valeur_argus: {
            type: DataTypes.DECIMAL(10, 2),
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
        tableName: 'vehicules',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Vehicule.associate = (models) => {
        Vehicule.belongsTo(models.Assure, {
            foreignKey: 'id_assure',
            as: 'assure'
        });

        Vehicule.hasMany(models.Sinistre, {
            foreignKey: 'id_vehicule',
            as: 'sinistres'
        });
    };

    return Vehicule;
};