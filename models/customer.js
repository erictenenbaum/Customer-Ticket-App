module.exports = function(sequelize, DataTypes) {
    var Customers = sequelize.define("Customers", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
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
            type: DataTypes.STRING
        }


    }, {underscored: true});
    
   Customers.associate = function(models) {    
    models.Customers.hasMany(models.Ticket, {
      onDelete: "cascade"
    });
  };

  
    return Customers;
};