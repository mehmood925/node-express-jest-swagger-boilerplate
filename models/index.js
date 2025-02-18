const { AiHealthLogs } = require('./aiHealthLogs');
const { Appointments } = require('./appointments');
const { LabValues } = require('./labValues');
const { MedicationBarcodes } = require('./medicationBarcodes');
const { Medications } = require('./medications');
const { Payments } = require('./payments');
const { Roles } = require('./roles');
const { Subscriptions } = require('./subscriptions');
const { Symptoms } = require('./symptoms');
const { UserAuthProviders } = require('./userAuthProviders');
const { UserFirebaseTokens } = require('./userFirebaseTokens');
const { UserHealthcareProviders } = require('./userHealthcareProviders');
const { UserKnownAssociations } = require('./userKnownAssociations');
const { UserLabValues } = require('./userLabValues');
const { UserMedicationLogs } = require('./userMedicationLogs');
const { UserMedicationSchedules } = require('./userMedicationSchedules');
const { UserMedications } = require('./userMedications');
const { UserSubscriptions } = require('./userSubscriptions');
const { UserSymptoms } = require('./userSymptoms');
const { Users } = require('./users');

Roles.hasMany(Users, {
  as: 'Roles_Users',
  foreignKey: 'role_id',
});
Users.belongsTo(Roles, {
  as: 'Users_Roles',
  foreignKey: 'role_id',
});

Users.hasMany(UserKnownAssociations, {
  as: 'Users_UserKnownAssociations',
  foreignKey: 'user_id',
});
UserKnownAssociations.belongsTo(Users, {
  as: 'UserKnownAssociations_Users',
  foreignKey: 'user_id',
});

Users.hasMany(UserAuthProviders, {
  as: 'Users_UserAuthProviders',
  foreignKey: 'user_id',
});
UserAuthProviders.belongsTo(Users, {
  as: 'UserAuthProviders_Users',
  foreignKey: 'user_id',
});

Users.hasMany(Appointments, {
  as: 'Users_Appointments',
  foreignKey: 'user_id',
});
Appointments.belongsTo(Users, {
  as: 'Appointments_Users',
  foreignKey: 'user_id',
});

Users.hasMany(AiHealthLogs, {
  as: 'Users_AiHealthLogs',
  foreignKey: 'user_id',
});
AiHealthLogs.belongsTo(Users, {
  as: 'AiHealthLogs_Users',
  foreignKey: 'user_id',
});

Users.hasMany(UserHealthcareProviders, {
  as: 'Users_UserHealthcareProviders',
  foreignKey: 'user_id',
});
UserHealthcareProviders.belongsTo(Users, {
  as: 'UserHealthcareProviders_Users',
  foreignKey: 'user_id',
});

Medications.hasMany(MedicationBarcodes, {
  as: 'Medications_MedicationBarcodes',
  foreignKey: 'medication_id',
});
MedicationBarcodes.belongsTo(Medications, {
  as: 'MedicationBarcodes_Medications',
  foreignKey: 'medication_id',
});

Medications.hasMany(UserMedications, {
  as: 'Medications_UserMedications',
  foreignKey: 'medication_id',
});
UserMedications.belongsTo(Medications, {
  as: 'UserMedications_Medications',
  foreignKey: 'medication_id',
});

Users.hasMany(UserMedications, {
  as: 'Users_UserMedications',
  foreignKey: 'user_id',
});
UserMedications.belongsTo(Users, {
  as: 'UserMedications_Users',
  foreignKey: 'user_id',
});

Medications.hasMany(UserMedicationSchedules, {
  as: 'Medications_UserMedicationSchedules',
  foreignKey: 'medication_id',
});
UserMedicationSchedules.belongsTo(Medications, {
  as: 'UserMedicationSchedules_Medications',
  foreignKey: 'medication_id',
});

Users.hasMany(UserMedicationSchedules, {
  as: 'Users_UserMedicationSchedules',
  foreignKey: 'user_id',
});
UserMedicationSchedules.belongsTo(Users, {
  as: 'UserMedicationSchedules_Users',
  foreignKey: 'user_id',
});

Medications.hasMany(UserMedicationLogs, {
  as: 'Medications_UserMedicationLogs',
  foreignKey: 'medication_id',
});
UserMedicationLogs.belongsTo(Medications, {
  as: 'UserMedicationLogs_Medications',
  foreignKey: 'medication_id',
});

Users.hasMany(UserMedicationLogs, {
  as: 'Users_UserMedicationLogs',
  foreignKey: 'user_id',
});
UserMedicationLogs.belongsTo(Users, {
  as: 'UserMedicationLogs_Users',
  foreignKey: 'user_id',
});

Subscriptions.hasMany(UserSubscriptions, {
  as: 'Subscriptions_UserSubscriptions',
  foreignKey: 'subscription_id',
});
UserSubscriptions.belongsTo(Subscriptions, {
  as: 'UserSubscriptions_Subscriptions',
  foreignKey: 'subscription_id',
});

Users.hasMany(UserSubscriptions, {
  as: 'Users_UserSubscriptions',
  foreignKey: 'user_id',
});
UserSubscriptions.belongsTo(Users, {
  as: 'UserSubscriptions_Users',
  foreignKey: 'user_id',
});

Subscriptions.hasMany(Payments, {
  as: 'Subscriptions_Payments',
  foreignKey: 'subscription_id',
});
Payments.belongsTo(Subscriptions, {
  as: 'Payments_Subscriptions',
  foreignKey: 'subscription_id',
});

Users.hasMany(Payments, {
  as: 'Users_Payments',
  foreignKey: 'user_id',
});
Payments.belongsTo(Users, {
  as: 'Payments_Users',
  foreignKey: 'user_id',
});

Symptoms.hasMany(UserSymptoms, {
  as: 'Symptoms_UserSymptoms',
  foreignKey: 'symptom_id',
});
UserSymptoms.belongsTo(Symptoms, {
  as: 'UserSymptoms_Symptoms',
  foreignKey: 'symptom_id',
});

Users.hasMany(UserSymptoms, {
  as: 'Users_UserSymptoms',
  foreignKey: 'user_id',
});
UserSymptoms.belongsTo(Users, {
  as: 'UserSymptoms_Users',
  foreignKey: 'user_id',
});

LabValues.hasMany(UserLabValues, {
  as: 'LabValues_UserLabValues',
  foreignKey: 'lab_value_id',
});
UserLabValues.belongsTo(LabValues, {
  as: 'UserLabValues_LabValues',
  foreignKey: 'lab_value_id',
});

Users.hasMany(UserLabValues, {
  as: 'Users_UserLabValues',
  foreignKey: 'user_id',
});
UserLabValues.belongsTo(Users, {
  as: 'UserLabValues_Users',
  foreignKey: 'user_id',
});

Users.hasMany(UserFirebaseTokens, {
  as: 'Users_UserFirebaseTokens',
  foreignKey: 'user_id',
});
UserFirebaseTokens.belongsTo(Users, {
  as: 'UserFirebaseTokens_Users',
  foreignKey: 'user_id',
});

module.exports = {
  AiHealthLogs,
  Appointments,
  LabValues,
  MedicationBarcodes,
  Medications,
  Payments,
  Roles,
  Subscriptions,
  Symptoms,
  UserAuthProviders,
  UserFirebaseTokens,
  UserHealthcareProviders,
  UserKnownAssociations,
  UserLabValues,
  UserMedicationLogs,
  UserMedicationSchedules,
  UserMedications,
  UserSubscriptions,
  UserSymptoms,
  Users,
};
