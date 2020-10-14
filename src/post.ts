import fs from 'fs';
import path from 'path';
import { frontmatter, lex, render } from '../markdown/src';

const PATH_RE = /^(\d{4})-(\d{2})-(\d{2})-(.*)$/;

const getText = (token: any) => {
  const texts:string[] = [];
  if (token.type === 'text') {
    texts.push(token.text);
  } else {
    token.children.forEach((child: any) => {
      texts.push(...getText(child));
    });
  }
  return texts;
};

// eslint-disable-next-line import/prefer-default-export
export function readPost(srcDir: string, root: string) { // 해당 dir 에 있는 파일을 로딩한다
  const assets = fs.readdirSync(path.join(root, srcDir));
  const mdfile = assets.find((name) => path.extname(name) === '.md');
  if (mdfile === undefined) {
    throw Error(`markdown file not exists: ${srcDir}`);
  }

  const result = PATH_RE.exec(srcDir);
  if (result === null) {
    throw Error(`folder name incorrect : ${srcDir}`);
  }
  const createdAt = Date.parse(`${result[1]}/${result[2]}/${result[3]}`);
  const src = fs.readFileSync(path.join(root, srcDir, mdfile), 'utf-8');
  const fm = frontmatter(src);
  if (fm === null) {
    throw Error(`front matter not exists : ${mdfile}`);
  }
  const { title } = fm.variables;
  const { author } = fm.variables;

  if (title === undefined) {
    throw Error(`title not exists :${mdfile}`);
  }

  if (author === undefined) {
    throw Error(`author not exists :${mdfile}`);
  }

  const maxDigest = 120;
  const tokens = lex(fm.content);
  const srcText = tokens.map((token) => getText(token).join(' ')).join(' ');
  const digest = `${srcText.substring(0, maxDigest).replace(/\n/g, ' ')}...`;
  const html = render(tokens);

  return {
    path: srcDir,
    title,
    author,
    time: createdAt,
    digest,
    assets,
    html,
  };
}

export default function post(srcDir: string, root: string) {
  const loaded = readPost(srcDir, root);
  return `<html>
  <head>
    <meta charSet="utf-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no"></meta>
    <link rel="stylesheet" href="../base.css"/>
    <link rel="stylesheet" href="../markdown.css"/>
    <link rel="stylesheet" href="../highlight.css"/>
  </head>
  <body>
    <header class="site-header">
      <div class="wrapper">
        <nav class="site-nav">
          <div class="trigger">
            <a class="page-link" href="../">home</a>
          </div>
        </nav>
      </div>
    </header>
    <div class="page-content">
      <div class="wrapper">
        <div class="post">
          <header class="post-header">
            <h1 class="post-title">${loaded.title}</h1>
            <p></p>
          </header>
          <div class="articlebox">
            <div class="markdown-body">
${loaded.html}
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}
