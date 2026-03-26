module.exports = (sequelize, DataTypes) => {
  const SecuriteUtilisateur = sequelize.define('SecuriteUtilisateur', {
    id_securite: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_securite: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    canal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expire_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'securite_utilisateur',
    timestamps: false
  });

  SecuriteUtilisateur.associate = (models) => {
    SecuriteUtilisateur.belongsTo(models.User, {
      foreignKey: 'id_utilisateur',
      as: 'user'
    });
  };

  return SecuriteUtilisateur;
};