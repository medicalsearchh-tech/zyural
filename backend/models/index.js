const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const db = {
  sequelize,
  Sequelize,
  User: require('./User')(sequelize, Sequelize.DataTypes),
  Course: require('./Course')(sequelize, Sequelize.DataTypes),
  Category: require('./Category')(sequelize, Sequelize.DataTypes),
  Specialty: require('./Specialty')(sequelize, Sequelize.DataTypes),
  Section: require('./Section')(sequelize, Sequelize.DataTypes),
  Lesson: require('./Lesson')(sequelize, Sequelize.DataTypes),
  Enrollment: require('./Enrollment')(sequelize, Sequelize.DataTypes),
  Payment: require('./Payment')(sequelize, Sequelize.DataTypes),
  Certificate: require('./Certificate.js')(sequelize, Sequelize.DataTypes),
  CertificateTemplate: require('./CertificateTemplate.js')(sequelize, Sequelize.DataTypes),
  StudentCertificate: require('./StudentCertificate.js')(sequelize, Sequelize.DataTypes),
  Progress: require('./Progress')(sequelize, Sequelize.DataTypes),
  Quiz: require('./Quiz')(sequelize, Sequelize.DataTypes),
  QuizAttempt: require('./QuizAttempt')(sequelize, Sequelize.DataTypes),
  QuizAttemptAnswer: require('./QuizAttemptAnswer')(sequelize, Sequelize.DataTypes),
  Question: require('./Question')(sequelize, Sequelize.DataTypes),
  Answer: require('./Answer')(sequelize, Sequelize.DataTypes),
  Review: require('./Review')(sequelize, Sequelize.DataTypes),
  SyllabusDocument: require('./SyllabusDocument')(sequelize, Sequelize.DataTypes),

  Notification: require('./Notification')(sequelize, Sequelize.DataTypes),
  Conversation: require('./Conversation')(sequelize, Sequelize.DataTypes),
  Message: require('./Message')(sequelize, Sequelize.DataTypes),

  ContactMessage: require('./ContactMessage')(sequelize, Sequelize.DataTypes),
};

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;