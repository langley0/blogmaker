import express from 'express';
import { log } from 'console';
import mainpage from './mainpage';
import post from './post';

const app = express();
const root = '../langley0@github.io';

app.get('/', (req, res) => {
  res.send(mainpage(root));
});

app.get('/:post', (req, res, next) => {
  try {
    const srcDir = req.params.post;

    // 포스트를 읽는다
    res.send(post(srcDir, root));
  } catch {
    next();
  }
});

app.use(express.static(root));
app.listen(3000, () => {
  log('dev web server started at port 3000');
});
