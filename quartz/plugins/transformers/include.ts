import { QuartzTransformerPlugin } from "../types";

interface FileData {
  content: string | null;
  filename: string | null;
}

interface Options {
  includeHeader?: boolean;
}

export const SourceInclude: QuartzTransformerPlugin<Partial<Options>> = (
  userOpts
) => {
  return {
    name: "SourceInclude",

    markdownPlugins: () => [],

    transformMarkdown(mdContent: string, fileData: FileData): string {
      const { content, filename } = fileData;

      if (!content || !filename) return mdContent;

      const fileExtension =
        typeof filename === "string" && filename.includes(".")
          ? filename.split(".").pop() ?? ""
          : "";

      const bracketSyntaxRegex = /!\[\[([^\]]+)\]\]/g;

      const updatedMdContent = mdContent.replace(bracketSyntaxRegex,
        (_, fileName) => {
          if (fileName === filename) {
            return `~~~${fileExtension}\n${content}\n~~~`;
          }
          return `![${fileName}](${fileName})`;
        }
      );

      return updatedMdContent;
    },
  };
};
