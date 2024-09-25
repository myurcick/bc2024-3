const fs = require('fs');
const { program } = require('commander');

// Налаштування команд
program
  .option('-i, --input <type>', 'шлях до файлу, який даємо для читання')
  .option('-o, --output <type>', 'шлях до файлу, у якому записуємо результат')
  .option('-d, --display', 'вивести результат у консоль');

// Парсинг аргументів
program.parse(process.argv);

// Отримання параметрів
const options = program.opts();

// Перевірка наявності обов'язкового параметра input
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// Функція для читання JSON файлу
function readJsonFile(filePath) {
  try {
    // Перевірка наявності файлу
    if (!fs.existsSync(filePath)) {
      console.error("Cannot find input file");
      process.exit(1);
    }

    // Читання файлу
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing the file:", error.message);
    process.exit(1);
  }
}

// Функція для запису результату у файл
function writeToFile(outputPath, data) {
  try {
    fs.writeFileSync(outputPath, data);
    console.log(`Result has been written to ${outputPath}`);
  } catch (error) {
    console.error("Error writing to file:", error.message);
  }
}

// Основна логіка програми
function main() {
  // Читання вхідного файлу
  const inputData = readJsonFile(options.input);
  
  // Фільтрація даних за ключем "parent"
  const filteredResults = inputData.filter(item => item.parent === "BS3_BanksLiab");

  // Форматування результату
  let resultString = "";
  filteredResults.forEach(item => {
    // Перевірка, що всі потрібні поля існують
    if (item.txten && item.value !== undefined) {
      resultString += `${item.txten}: ${item.value}\n`;
    }
  });

  // Якщо не знайдено жодного показника
  if (!resultString) {
    console.log("No matching data found for parent 'BS3_BanksLiab'.");
    return;
  }

  // Якщо не задано ні output, ні display - не виводимо нічого
  if (!options.output && !options.display) {
    return;
  }

  // Якщо задано параметр display - виводимо результат у консоль
  if (options.display) {
    console.log("Result:", resultString);
  }

  // Якщо задано параметр output - записуємо результат у файл
  if (options.output) {
    writeToFile(options.output, resultString);
  }
}

// Виклик основної функції
main();



