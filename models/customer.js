module.exports = function(sequelize, DataTypes) {
    var Customers = sequelize.define("Customers", {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
        customer_first_name: {
            type: DataTypes.STRING,
            
        },
        customer_last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_phone: {
            type: DataTypes.STRING,
            allowNull: false      
                  
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNull: false
        }


    }, {underscored: true});
    
   //Customers.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    //models.Customers.hasMany(models.Ticket, {
    //  onDelete: "cascade"
   //});
  //};

  
    return Customers;
};