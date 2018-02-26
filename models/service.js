module.exports = function(sequelize, DataTypes) {
  var Service = sequelize.define(
    "Service",
    {
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      service_name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      service_description: {
        type: Data.STRING,
        allowNull: false
      }
    },
    { underscored: true }
  );

  //NOTE FOR TEAM: There will be only 3 agents as reference and they cant be erase. these agents will
  //be at all times on the database, because we will treat them as company workers. This database should not have Foreing keys.
  //We should discuse the underscore here.

  //Agent.associate = function(models) {
  // Associating Author with Posts
  // When an Author is deleted, also delete any associated Posts
  //models.Agent.hasMany(models.Ticket, {
  //  onDelete: "cascade"
  //});
  //};

  return Service;
};
