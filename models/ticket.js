module.exports = function(sequelize, DataTypes) {
    var Ticket = sequelize.define("Ticket", {
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
<<<<<<< HEAD

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
        },
        chat_conversation{
            type: DataTypes.JSON,
            allowNull: false
=======
>>>>>>> 9bfa80e44a3504456f7d25121cf6cc8f40f9aaa4
        }
    }, { underscored: true });

<<<<<<< HEAD
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

  
=======
    Ticket.associate = function(models) {
        models.Ticket.belongsTo(models.Customers, {
            foreignKey: {
                allowNull: false
            }
        });
    };
>>>>>>> 9bfa80e44a3504456f7d25121cf6cc8f40f9aaa4
    return Ticket;
};