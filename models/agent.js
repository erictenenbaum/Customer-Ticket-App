module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
        agent_first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        agent_last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }


    }, {underscored: true});
    
   Agent.associate = function(models) {   
    models.Agent.hasMany(models.Ticket, {
      onDelete: "cascade"
    });
  };

  
    return Agent;
};