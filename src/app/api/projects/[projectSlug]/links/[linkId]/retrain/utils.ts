import { openai } from "@/lib/openai";
import * as cheerio from "cheerio";
import type { Root, RootContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { toMarkdown } from "mdast-util-to-markdown";
import { toString } from "mdast-util-to-string";
import { NodeHtmlMarkdown } from "node-html-markdown";
import type { ResponseTypes } from "openai-edge";
import { u } from "unist-builder";

export const htmlToMarkdown = (html: string) => {
  const $ = cheerio.load(html);
  const title = $("title").text();
  const body = $("body").html();
  if (!body || !body.length) {
    throw "No <body> tag found in the webpage.";
  }
  const markdown = NodeHtmlMarkdown.translate(body);
  return { markdown, metadata: { title } };
};

export function splitTreeBy(
  tree: Root,
  predicate: (node: RootContent) => boolean,
) {
  return tree.children.reduce<Root[]>((trees, node) => {
    const [lastTree] = trees.slice(-1);

    if (!lastTree || predicate(node)) {
      const tree: Root = u("root", [node]);
      return trees.concat(tree);
    }

    lastTree.children.push(node);
    return trees;
  }, []);
}

export function splitMarkdownBySections(markdown: string) {
  const mdTree = fromMarkdown(markdown, {
    mdastExtensions: [mdxFromMarkdown()],
  });

  const sectionTrees = splitTreeBy(mdTree, (node) => node.type === "heading");

  const sections = sectionTrees.map((tree) => {
    const [firstNode] = tree.children;

    const heading =
      firstNode.type === "heading" ? toString(firstNode) : undefined;

    return {
      content: toMarkdown(tree),
      heading,
    };
  });
  return sections;
}

export async function generateEmbeddingFromSections(
  sections: { content: string; heading?: string }[],
) {
  return Promise.all(
    sections.map(async ({ content, heading }) => {
      const res = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: content,
      });
      const data = (await res.json()) as ResponseTypes["createEmbedding"];
      const embedding = data.data[0].embedding;
      const tokenCount = data.usage.total_tokens;
      return {
        content,
        embedding,
        tokenCount,
        metadata: {
          heading,
          model: data.model,
        },
      };
    }),
  );
}
