module.exports = function(sequelize, DataTypes) {
    var Ticket = sequelize.define("Ticket", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    }, { underscored: true });

    Ticket.associate = function(models) {
        models.Ticket.belongsTo(models.Customers, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Ticket;
};