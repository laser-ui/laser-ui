import hljs from 'highlight.js';
import { marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';

const renderer = new Renderer();
renderer.heading = function (text, level) {
  const link = `<a href="#${text}" class="app-anchor">#</a>`;
  const head = `
<h${level} id="${text}" class="app-h app-h--${level}">
  <span>${text}</span>
  ${link}
</h${level}>
`;
  return head;
};
renderer.table = function (header: string, body: string) {
  return `
<div class="app-table-container">
 <table>
   <thead>${header}</thead>
   <tbody>${body}</tbody>
 </table>
</div>
`;
};
renderer.list = function (body) {
  return `
<ul class="app-list">
   ${body}
</ul>
`;
};
renderer.link = function (href, title, text) {
  return `
<a class="app-link" href="${href}" ${title ? `title="${title}"` : ''}>
   ${text}
</a>
`;
};

marked.use({
  renderer,
  mangle: false,
  headerIds: false,
});
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

export default marked.parse;
