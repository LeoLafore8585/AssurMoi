module.exports = (sequelize, DataTypes) => {
    const Contrat = sequelize.define('Contrat', {
        id_contrat: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reference_contrat: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        id_assure: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type_contrat: {
            type: DataTypes.STRING,
            allowNull: false
        },
        franchise: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        date_debut: {
            type: DataTypes.DATE,
            allowNull: true
        },
        date_fin: {
            type: DataTypes.DATE,
            allowNull: true
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
        tableName: 'contrats',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Contrat.associate = (models) => {
        Contrat.belongsTo(models.Assure, {
            foreignKey: 'id_assure',
            as: 'assure'
        });

        Contrat.hasMany(models.Sinistre, {
            foreignKey: 'id_contrat',
            as: 'sinistres'
        });
    };

    return Contrat;
};