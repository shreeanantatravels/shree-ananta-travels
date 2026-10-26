const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkGfm = require('remark-gfm');
const remarkRehype = require('remark-rehype');
const rehypeRaw = require('rehype-raw');
const rehypeStringify = require('rehype-stringify');

const indentedHtml = `<div class="container">

    <!-- 1 -->
    <div class="card">
        <p>Text</p>
    </div>

</div>`;

const unindentedHtml = `<div class="container">
<!-- 1 -->
<div class="card">
<p>Text</p>
</div>
</div>`;

async function test() {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify);

  const res1 = await processor.process(indentedHtml);
  console.log('--- INDENTED OUTPUT ---');
  console.log(String(res1));

  const res2 = await processor.process(unindentedHtml);
  console.log('--- UNINDENTED OUTPUT ---');
  console.log(String(res2));
}

test().catch(console.error);
