module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('Document', {
        id_document: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_sinistre: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_dossier: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type_document: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nom_fichier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        chemin_fichier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        statut_validation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        valide_par: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        date_validation: {
            type: DataTypes.DATE,
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
        tableName: 'documents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Document.associate = (models) => {
        Document.belongsTo(models.Sinistre, {
            foreignKey: 'id_sinistre',
            as: 'sinistre'
        });

        Document.belongsTo(models.Dossier, {
            foreignKey: 'id_dossier',
            as: 'dossier'
        });

        Document.belongsTo(models.User, {
            foreignKey: 'valide_par',
            as: 'validateur'
        });
    };

    return Document;
};