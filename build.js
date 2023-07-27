const { exec } = require('child_process');
const fs = require('fs');
const { join } = require('path');

const frontendDistPath = join(__dirname, 'frontend', 'dist');
const backendPublicPath = join(__dirname, 'backend', 'public');

// 判断是否在 GitHub Actions 中运行
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

// 使用 yarn 或 yarn.cmd 根据环境判断
const yarnCommand = isGitHubActions ? 'yarn' : 'yarn.cmd';

// 1. 执行 frontend 目录下的 yarn build
exec(`${yarnCommand} build`, { cwd: 'frontend' }, (error, stdout, stderr) => {
  if (error) {
    console.error('Failed to build frontend:', error.message);
    return;
  }

  console.log('Frontend build successful.');
  // 检查 backend/public 是否存在，不存在就mkdir
  if (!fs.existsSync(backendPublicPath)) {
    fs.mkdirSync(backendPublicPath);
  }

  // 2. 移动 frontend/dist 下的所有文件到 backend/public
  fs.readdir(frontendDistPath, (err, files) => {
    if (err) {
      console.error('Failed to read frontend/dist directory:', err);
      return;
    }

    files.forEach((file) => {
      const sourceFilePath = join(frontendDistPath, file);
      const targetFilePath = join(backendPublicPath, file);

      fs.rename(sourceFilePath, targetFilePath, (err) => {
        if (err) {
          console.error(`Failed to move ${file} to backend/public:`, err);
          return;
        }

        console.log(`Moved ${file} to backend/public.`);
      });
    });

    // 3. 执行 backend 目录下的 yarn build
    if (isGitHubActions) {
      console.log('Skipping backend build on GitHub Actions.');
    } else {
      exec(`${yarnCommand} build`, { cwd: 'backend' }, (error, stdout, stderr) => {
        if (error) {
          console.error('Failed to build backend:', error.message);
          return;
        }

        console.log('Backend build successful.');
        // 删掉 backend/public 
        fs.rmdirSync(backendPublicPath, { recursive: true });
        
      });
    }
  });
});
