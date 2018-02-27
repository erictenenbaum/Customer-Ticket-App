module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
        agent_first_name: {
            type: DataTypes.STRING,
<<<<<<< HEAD
            allowNull: false
        },
        
        agent_phone: 
        {
            type:Data.INTEGER,
            allowNull: false
        },
        agent_email:
        {
            type: DataTypes.STRING,
            allowNull: false
=======
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
>>>>>>> 9bfa80e44a3504456f7d25121cf6cc8f40f9aaa4
        }


    }, {underscored: true});
    
<<<<<<< HEAD
    //NOTE FOR TEAM: There will be only 3 agents as reference and they cant be erase. these agents will 
    //be at all times on the database, because we will treat them as company workers. This database should not have Foreing keys.
    //We should discuse the underscore here.

   //Agent.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    //models.Agent.hasMany(models.Ticket, {
    //  onDelete: "cascade"
    //});
    //};
=======
   Agent.associate = function(models) {   
    models.Agent.hasMany(models.Ticket, {
      onDelete: "cascade"
    });
  };
>>>>>>> 9bfa80e44a3504456f7d25121cf6cc8f40f9aaa4

  
    return Agent;
};