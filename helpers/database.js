const sequelize = require('../modules/sequelize')

module.exports = {
  simpleAnswer: (entity, keyword) => {
    return sequelize.query(`
      SELECT text as "Answer"
      FROM Sentences
        JOIN Entities ON Entities.id = entity_id
        JOIN Keywords ON Keywords.id = keyword_id
      WHERE Entities.name = '${entity.name}'
        AND Keywords.name = '${keyword}'
      ORDER BY RAND()
        LIMIT 1;
    `)
  }
}