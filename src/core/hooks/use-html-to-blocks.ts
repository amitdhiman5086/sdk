import { ChaiBlock } from "@/types/chai-block";
import { getRegisteredChaiBlock, syncBlocksWithDefaults } from "@chaibuilder/runtime";
import { each, filter, find, pick, startsWith } from "lodash-es";
import { useCallback } from "react";
import { getBlocksFromHTML, mergeBlocksWithExisting } from "../import-html/html-to-json";
import { useBlocksStore } from "./hooks";

export const handlei18N = (blocks: ChaiBlock[], currentBlocks: ChaiBlock[]) => {
  return blocks.map((block) => {
    const blockDefinition = getRegisteredChaiBlock(block._type);

    if (!blockDefinition) return block;
    const i18nProps = blockDefinition.i18nProps;
    if (!i18nProps) return block;
    const typeBlocks = filter(currentBlocks, { _type: block._type });
    const values = pick(block, i18nProps);

    each(values, (value, key) => {
      const b = find(typeBlocks, (tB) => {
        const v = typeof tB[key] === "string" ? tB[key]?.trim().toLowerCase() : JSON.stringify(tB[key]);
        const v2 = typeof value === "string" ? value.trim().toLowerCase() : JSON.stringify(value);
        return v === v2;
      });
      if (b) {
        const i18nKeys = filter(Object.keys(b), (k) => startsWith(k, `${key}-`));
        const i18nValues = pick(b, i18nKeys);
        block = { ...block, ...i18nValues };
      }
    });
    return block;
  });
};

export const useHtmlToBlocks = () => {
  const [currentBlocks] = useBlocksStore();
  return useCallback(
    (html: string) => {
      const importedBlocks = syncBlocksWithDefaults(getBlocksFromHTML(html));
      const mergedBlocks = mergeBlocksWithExisting(importedBlocks, currentBlocks);
      return handlei18N(mergedBlocks, currentBlocks);
    },
    [currentBlocks],
  );
};
