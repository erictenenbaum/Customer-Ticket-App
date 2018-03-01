module.exports = function(sequelize, DataTypes) {
    var Customers = sequelize.define("Customers", {
        customer_first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_phone: {
            type: DataTypes.STRING
        },
        customer_email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }

    }, { underscored: true });

    Customers.associate = function(models) {
        models.Customers.hasMany(models.Ticket, {
            onDelete: "cascade"
        });
    };


    return Customers;
};