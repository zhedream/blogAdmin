import { marked } from 'marked';
import DOMPurify from 'dompurify';
// Persist the same sanitized HTML that is previewed; never execute raw Markdown HTML.
export function renderMarkdown(source: string) {
  const html = DOMPurify.sanitize(marked.parse(source, { async: false, gfm: true, breaks: true }), { USE_PROFILES: { html: true }, FORBID_TAGS: ['style', 'iframe', 'form', 'input', 'button'], FORBID_ATTR: ['style'] });
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const toc = document.createElement('ul');
  doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((heading,index)=>{
    heading.id=`heading-${index+1}`;
    const li=document.createElement('li'); const a=document.createElement('a'); a.href=`#${heading.id}`;a.textContent=heading.textContent;li.append(a);toc.append(li);
  });
  doc.querySelectorAll('a[href]').forEach(a=>{ if(!a.getAttribute('href')?.startsWith('#')){ a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer'); } });
  return { html: doc.body.innerHTML, catalogue: toc.children.length ? toc.outerHTML : '' };
}
