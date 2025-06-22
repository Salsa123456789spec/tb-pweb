export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'name', {
        type: Sequelize.STRING
    });
    await queryInterface.addColumn('Users', 'nim', {
        type: Sequelize.STRING,
        unique: true
    });
    await queryInterface.addColumn('Users', 'email', {
        type: Sequelize.STRING,
        unique: true
    });
    await queryInterface.addColumn('Users', 'password', {
        type: Sequelize.STRING
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'name');
    await queryInterface.removeColumn('Users', 'nim');
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'password');
}