'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(15),
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      emailVerificationOTP: {
        type: Sequelize.INTEGER,
      },
      emailVerificationOTPExpiry: {
        type: Sequelize.STRING,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      phoneVerificationOTP: {
        type: Sequelize.INTEGER,
      },
      phoneVerificationOTPExpiry: {
        type: Sequelize.INTEGER,
      },
      phoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      inAppNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      pushNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      emailNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      smsNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      forgotPasswordOTP: {
        type: Sequelize.INTEGER,
      },
      forgotPasswordOTPExpiry: {
        type: Sequelize.INTEGER,
      },
      forgotPasswordOTPVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordExpiry: {
        type: Sequelize.INTEGER,
      },
      timezone: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('userTokens', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('medications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('symptoms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      symptom: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('userMedications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      medicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medications',
          key: 'id',
        },
      },
      dosage: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      frequency: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reminder: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      reminderSchedule: {
        type: Sequelize.JSONB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      doctorName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      appointmentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('userSymptoms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      symptomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'symptoms',
          key: 'id',
        },
      },
      severity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      loggedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('userTokens', ['userId']);
    await queryInterface.addIndex('medications', ['name']);
    await queryInterface.addIndex('symptoms', ['symptom']);
    await queryInterface.addIndex('userMedications', ['userId']);
    await queryInterface.addIndex('appointments', ['userId']);
    await queryInterface.addIndex('userSymptoms', ['userId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('userSymptoms');
    await queryInterface.dropTable('appointments');
    await queryInterface.dropTable('userMedications');
    await queryInterface.dropTable('symptoms');
    await queryInterface.dropTable('medications');
    await queryInterface.dropTable('userTokens');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
  },
};
