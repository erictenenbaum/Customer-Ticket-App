module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        agent_first_name: {
            type: DataTypes.STRING,
            validate: {
                allowNull: false,
                min: 1
            }
        },
        agent_last_name: {
            type: DataTypes.STRING,
            validate: {
                allowNull: false,
                min: 1
            }
        },
        email: {
            type: DataTypes.TEXT,
            validate: {
                allowNull: false,
                min: 1
            }
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                allowNull: false,
                min: 1
            }
        },
        password: {
            type: DataTypes.TEXT,
            validate: {
                allowNull: false,
                min: 1
            }
        }


    }, { underscored: true });

    Agent.associate = function(models) {
        models.Agent.hasMany(models.Ticket, {
            onDelete: "cascade"
        });
    };


    return Agent;
};