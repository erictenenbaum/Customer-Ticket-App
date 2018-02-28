module.exports = function(sequelize, DataTypes) {
    var Ticket = sequelize.define("Ticket", {}, { underscored: true });

    Ticket.associate = function(models) {
        models.Ticket.belongsTo(models.Customers, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Ticket;
};