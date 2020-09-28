import { error } from 'console';
import fs from 'fs';
import path from 'path';
import mainpage from './mainpage';
import post, { readPost } from './post';

function makeDirectoryIfExists(dir: string) {
  if (fs.existsSync(dir) === false) {
    fs.mkdirSync(dir);
  }
}

const { argv } = process;
if (argv.length !== 4) {
  error('Usage: build.(ts|js) SRCDIR DSTDIR');
}

const srcDir = argv[2];
const dstDir = argv[3];

// 타겟 폴더를 생성
makeDirectoryIfExists(dstDir);

// 메인 index.html 을 생성
fs.writeFileSync(
  path.join(dstDir, 'index.html'),
  mainpage(srcDir),
  'utf-8',
);

const rootAssets = fs.readdirSync(srcDir)
  .filter((subDir) => !fs.lstatSync(path.join(srcDir, subDir)).isDirectory());

rootAssets.forEach((asset) => {
  fs.copyFileSync(
    path.join(srcDir, asset),
    path.join(dstDir, asset),
  );
});

// 각각의 파일목록을 가져와서 post 를 기록한다
const subDirs = fs.readdirSync(srcDir)
  .filter((subDir) => subDir !== '.git')
  .filter((subDir) => fs.lstatSync(path.join(srcDir, subDir)).isDirectory());

subDirs.forEach((subDir) => {
  const targetDir = path.join(dstDir, subDir);
  const loaded = readPost(subDir, srcDir);

  makeDirectoryIfExists(targetDir);
  fs.writeFileSync(
    path.join(targetDir, 'index.html'),
    post(subDir, srcDir),
    'utf-8',
  );

  loaded.assets.forEach((asset) => {
    fs.copyFileSync(
      path.join(srcDir, subDir, asset),
      path.join(dstDir, subDir, asset),
    );
  });
});
