var mongoose = require('mongoose'); // лучше использовать модуль ./mongoose

// мне кажеться лучще схему объявлять здесь, а не выносить в отдельный модуль
var ContactSchema = require('../schemes/contact');
// не используй пре хуки. Т.к. лучще использовать findOneAndUpdate а он хуки не вызывает
// findOneAndUpdate использовать лучше т.к. может возникнуть ситуация что перед вызовом .save()
// кто-то другой удалит модель и ты получишь неожиданный exception
// если тебе нужно делать что-то перед сохроненеием, лучще сделать модуль который будет оберткой над моделью
// и использовать всегда его
ContactSchema.pre('save', function (next) {
  now = new Date();
  if (!this.modificationDate) {
    this.modificationDate = now;
  }
  next();
});

var ContactModel = mongoose.model('Contact', ContactSchema, 'contacts');

module.exports = ContactModel;
