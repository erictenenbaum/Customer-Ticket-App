module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
        agent_name: {
            type: DataTypes.STRING,
            allowNull: false
        }


    }, {underscored: true});
    
   Agent.associate = function(models) {   
    models.Agent.hasMany(models.Ticket, {
      onDelete: "cascade"
    });
  };

  
    return Agent;
};