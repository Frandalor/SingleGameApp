import chalk from 'chalk';

export const logger = {
  // INFO: Per messaggi normali (azzurro)
  info: (message, ...args) => {
    console.log(chalk.cyan.bold('ℹ️  [INFO]:'), message, ...args);
  },

  // SUCCESS: Per cose andate bene (verde)
  success: (message, ...args) => {
    console.log(chalk.green.bold('✅ [SUCCESS]:'), message, ...args);
  },

  // WARN: Per avvisi (giallo)
  warn: (message, ...args) => {
    console.log(chalk.yellow.bold('⚠️  [WARN]:'), message, ...args);
  },

  // ERROR: Per errori (rosso)
  error: (message, error = '') => {
    console.error(chalk.red.bold('❌ [ERROR]:'), message);
    if (error) {
      console.error(chalk.red(error.message || error));
    }
  },

  // START: Per l'avvio del server (magenta)
  start: (message) => {
    console.log(chalk.magenta.bold('🚀 [START]:'), message);
  },
};
