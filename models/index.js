const { Appointments } = require('./appointments');
const { Medications } = require('./medications');
const { Roles } = require('./roles');
const { Symptoms } = require('./symptoms');
const { UserMedications } = require('./userMedications');
const { Users } = require('./users');
const { UserSymptoms } = require('./userSymptoms');
const { UserTokens } = require('./userTokens');

Users.hasMany(Appointments, {
  as: 'users_appointments',
  foreignKey: 'userId',
});
Appointments.belongsTo(Users, {
  as: 'appointments_user',
  foreignKey: 'userId',
});

Roles.hasMany(Users, {
  as: 'users_roles',
  foreignKey: 'roleId',
});
Users.belongsTo(Roles, {
  as: 'roles_user',
  foreignKey: 'roleId',
});

Users.hasMany(UserMedications, {
  as: 'users_userMedications',
  foreignKey: 'userId',
});
UserMedications.belongsTo(Users, {
  as: 'userMedications_user',
  foreignKey: 'userId',
});

Medications.hasMany(UserMedications, {
  as: 'medications_userMedications',
  foreignKey: 'medicationId',
});
UserMedications.belongsTo(Medications, {
  as: 'userMedications_mediactions',
  foreignKey: 'medicationId',
});

Users.hasMany(UserSymptoms, {
  as: 'users_userSymptoms',
  foreignKey: 'userId',
});
UserSymptoms.belongsTo(Users, {
  as: 'userSymptoms_user',
  foreignKey: 'userId',
});

Symptoms.hasMany(UserSymptoms, {
  as: 'symptoms_userTokens',
  foreignKey: 'symptomId',
});
UserSymptoms.belongsTo(Symptoms, {
  as: 'userTokens_symptoms',
  foreignKey: 'symptomId',
});

Users.hasMany(UserTokens, {
  as: 'users_userTokens',
  foreignKey: 'userId',
});
UserTokens.belongsTo(Users, {
  as: 'userTokens_user',
  foreignKey: 'userId',
});

module.exports = {
  Appointments,
  Medications,
  Roles,
  Symptoms,
  UserMedications,
  Users,
  UserSymptoms,
  UserTokens,
};
