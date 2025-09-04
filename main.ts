import { Plugin } from 'obsidian';
import { ViewPlugin, EditorView, ViewUpdate } from '@codemirror/view';

export default class LatexLinksPlugin extends Plugin {
  async onload() {
    const fixLinks = (root: HTMLElement) => {
      const anchors = root
        .findAll('.math')
        .flatMap((math) => math.findAll('a')) as HTMLAnchorElement[];

      anchors.forEach((anchor) => {
        const href = anchor.href;

        if (!href) return;

        const [key] = href.split('=');

        if (key !== 'app://obsidian.md/file' && key !== 'file') return;

        anchor.href = `obsidian://open?file=${href.slice(key.length + 1)}`
      });

    }

    this.registerEditorExtension(ViewPlugin.fromClass(
      class {
        update(update: ViewUpdate) {
          fixLinks(update.view.dom);
        }
      }))

    this.registerMarkdownPostProcessor((element) => {
      fixLinks(element);
    });
  }
}

