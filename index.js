process.stdin.setEncoding('utf8');

const commands = [
  {
    command: '--help',
    answer: 'Доступные команды:\n--help    — печатает этот текст;\n--version — печатает версию приложения;'
  },
  {
    command: '--version',
    answer: process.env.npm_package_version
  },
  {
    command: '',
    answer: 'Привет пользователь!\nЭта программа будет запускать сервер \"'+ process.env.npm_package_name+'\".\nАвтор: Кекс.\n'
  }
];

const outputLine = '';

process.stdin.on('data', (chunk) => {
  const str = chunk.trim();
  commands.forEach((item) => {
    if (item.command == str) {
      console.log(item.answer);
      process.exit(0);
    }
  });
  console.error('Неизвестная команда ' + chunk + '\nЧтобы прочитать правила использования приложения, наберите \"--help\"\n');
  process.exit(1);
});

process.on('exit', (code) => {
  console.log('Exit with code: '+code);
});
