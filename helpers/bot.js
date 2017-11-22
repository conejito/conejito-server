const bot = require('../modules/wit-ai');

module.exports = {
  ask: bot.message,
  answer: (r) => { 
    if (!r.entities) return;
    if (r.entities.welcome) {
      const answers = [
        'Cześć :)',
        'Hej ;)',
        'No hej :D'
      ];
      return answers[Math.floor(Math.random() * answers.length)];
    }
    if (r.entities.event) {
      const answers = [
        'a więc chcesz się rozerwać? ;)',
        'juz szukam'
      ];
      return answers[Math.floor(Math.random() * answers.length)];
    }
    if (r.entities.place) {
      const answers = [
        'Skorzystaj z Google Maps :D',
        'Lokalizuję'
      ];
      return answers[Math.floor(Math.random() * answers.length)];
    }
    const answers = [
      'Nie zrozumiałem, spróbuj ująć to inaczej',
      'Nie do końca wiem o co chodzi',
      'Możesz powtórzyć?'
    ];
    return answers[Math.floor(Math.random() * answers.length)];
   }
};