module.exports = function(sequelize, DataTypes) {
    var Ticket = sequelize.define("Ticket", {
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {underscored: true});
    
   //Ticket.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    //models.Ticket.belongsTo(models.Customers, {
    //  foreignKey: {
    //    allowNull: false
     // }
    //});
 // };

  
    return Ticket;
};