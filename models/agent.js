module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true

        },
        agent_name: {
            type: DataTypes.STRING,
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
        }


    }, {underscored: true});
    
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

  
    return Agent;
};