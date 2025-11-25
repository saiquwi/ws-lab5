const { exec } = require('child_process');
require('dotenv').config();

// Простой скрипт для отката к предыдущей версии
console.log('Starting rollback procedure...');

// В реальном проекте здесь была бы логика отката
// Например, развертывание предыдущего Docker образа или git revert
exec('git log --oneline -2', (error, stdout, stderr) => {
  if (error) {
    console.error('Error getting git history:', error);
    return;
  }
  
  const commits = stdout.trim().split('\n');
  console.log('Last 2 commits:');
  commits.forEach(commit => console.log(commit));
  
  console.log('Rollback would revert to:', commits[1]);
  console.log('In production, this would deploy the previous version');
});