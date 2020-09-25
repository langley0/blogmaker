import fs from 'fs';
import path from 'path';
import { readPost } from './post';

export default function mainpage() {
  const root = 'public';
  if (fs.existsSync(root) === false) {
    throw Error('invalid target directory: public');
  }

  const posts = fs.readdirSync(root)
    .filter((srcDir) => fs.lstatSync(path.join(root, srcDir)).isDirectory())
    .map((srcDir) => readPost(srcDir, 'public'))
    .reverse();

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charSet="utf-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no"></meta>
    <link rel="stylesheet" href="./base.css"/>
  </head>
  <body>
    <div class="page-content">
      <div class="wrapper">
        <div class="header-bar">
          <h1>tech blog</h1>
          <h2>just for me</h2>
          <br/>
          <hr/>
          <br/>
        </div>
        <ul class="post-list">
        
  ${posts.map((post) => {
    const postUrl = `./${post.path}/`;
    return `
          <li>
            <h2>
              <a class="post-title" href=${postUrl}>${post.title}</a>
            </h2>
            <p class="post-meta">
              ${(new Date(post.time)).toLocaleDateString('kr-kr')}
            </p>
            <p style="margin-top: 20px;">
              ${post.digest}
              <a style="color: red" href="${postUrl}">More</a>
            </p>
            <hr/>
          </li>`;
  })}
        </ul>
      </div>
    </div>
  </body>
</html>`;
}
