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
    
  //  Customers.associate = function(models) {
  //   // Associating Author with Posts
  //   // When an Author is deleted, also delete any associated Posts
  //   models.Burger.hasMany(models.Customers, {
  //     onDelete: "cascade"
  //   });
  // };

  
    return Customers;
};