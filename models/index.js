const { UserModel } = require('./users');
const { AppointmentsModel } = require('./appointments');
const { MeedicationsModel } = require('./medications');
const { HealthLogsModel } = require('./healthLogs');

UserModel.hasMany(AppointmentsModel, {
  as: 'users_appointments',
  foreignKey: 'userId',
});
AppointmentsModel.belongsTo(UserModel, {
  as: 'appointments_user',
  foreignKey: 'userId',
});

UserModel.hasMany(HealthLogsModel, {
  as: 'users_healthlogs',
  foreignKey: 'userId',
});
HealthLogsModel.belongsTo(UserModel, {
  as: 'healthlogs_user',
  foreignKey: 'userId',
});

UserModel.hasMany(MeedicationsModel, {
  as: 'users_medications',
  foreignKey: 'userId',
});
MeedicationsModel.belongsTo(UserModel, {
  as: 'medications_user',
  foreignKey: 'userId',
});

module.exports = {
  UserModel,
  AppointmentsModel,
  MeedicationsModel,
  HealthLogsModel,
};
