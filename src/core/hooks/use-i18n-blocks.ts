import { getRegisteredChaiBlock } from "@chaibuilder/runtime";
import { compact, pick } from "lodash";
import { useCallback } from "react";
import { getBlockWithNestedChildren } from "./get-block-with-nested-children";
import { useBlocksStore } from "./hooks";
import { useSelectedBlock } from "./use-selected-blockIds";

export const useI18nBlocks = () => {
  const selectedBlock = useSelectedBlock();
  const [currentBlocks] = useBlocksStore();
  return useCallback(
    (lang: string | "ALL" = "") => {
      const blocks = selectedBlock?._id ? getBlockWithNestedChildren(selectedBlock._id, currentBlocks) : currentBlocks;
      if (!blocks) return [];
      return compact(
        blocks.map((block) => {
          const blockDefinition = getRegisteredChaiBlock(block._type);
          if (!blockDefinition) return null;
          const i18nProps = blockDefinition?.i18nProps ?? [];
          if (i18nProps.length === 0) return null;
          const keys =
            lang === "ALL"
              ? Object.keys(block).filter((key) => i18nProps.find((prop) => key.startsWith(prop)))
              : i18nProps.map((prop) => (lang ? `${prop}-${lang}` : prop));
          return pick(block, [...keys, "_id"]);
        }),
      );
    },
    [selectedBlock?._id, currentBlocks],
  );
};
