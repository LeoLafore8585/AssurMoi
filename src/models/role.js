module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'roles',
    timestamps: false
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'id_role',
      as: 'users'
    });
  };

  return Role;
};