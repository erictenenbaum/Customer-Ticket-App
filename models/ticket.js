module.exports = function(sequelize, DataTypes) {
    var Ticket = sequelize.define("Ticket", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        }


    }, {underscored: true});
    
   Ticket.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    models.Ticket.belongsTo(models.Customers, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  
    return Ticket;
};