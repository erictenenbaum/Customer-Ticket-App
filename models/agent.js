module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        agent_first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        agent_last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }


    }, { underscored: true });

    Agent.associate = function(models) {
        models.Agent.hasMany(models.Ticket, {
            onDelete: "cascade"
        });
    };


    return Agent;
};