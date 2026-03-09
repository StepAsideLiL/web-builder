import {
  type CommandProps,
  mergeAttributes,
  Node,
  type RawCommands,
} from "@tiptap/core";

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

/** Column-ratio presets for wbContainer */
export type WbContainerLayout = "equal" | "left-wide" | "right-wide";

/** Which side the column sits on */
export type WbColumnPosition = "left" | "right";

// ─────────────────────────────────────────────────────────────────────────────
// Attribute shapes
// ─────────────────────────────────────────────────────────────────────────────

export interface WbContainerAttrs {
  layout: WbContainerLayout;
}

export interface WbColumnAttrs {
  position: WbColumnPosition;
}

// ─────────────────────────────────────────────────────────────────────────────
// Command option types
// ─────────────────────────────────────────────────────────────────────────────

export interface InsertWbContainerOptions {
  /** Column-ratio preset. Defaults to 'equal'. */
  layout?: WbContainerLayout;
}

export interface InsertWbColumnOptions {
  /** Which side the new column appears on. Defaults to 'left'. */
  position?: WbColumnPosition;
}

// ─────────────────────────────────────────────────────────────────────────────
// Module augmentation — extends Tiptap's Commands interface
// This is what gives full autocomplete on editor.commands.*
// ─────────────────────────────────────────────────────────────────────────────

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    /**
     * Commands contributed by the **wbContainer** extension.
     *
     * @example
     * editor.commands.insertWbContainer()
     * editor.commands.insertWbContainer({ layout: 'left-wide' })
     */
    wbContainer: {
      /**
       * Insert a `<section class="wb-container">` block with two pre-filled
       * `wbColumn` children at the current cursor position.
       *
       * @param options - Optional layout override (default: `'equal'`).
       */
      insertWbContainer(options?: InsertWbContainerOptions): ReturnType;
    };

    /**
     * Commands contributed by the **wbColumn** extension.
     *
     * @example
     * editor.commands.insertWbColumn({ position: 'right' })
     */
    wbColumn: {
      /**
       * Insert a single `<div class="wb-column">` at the current cursor
       * position with an empty paragraph inside.
       *
       * @param options - Optional position override (default: `'left'`).
       */
      insertWbColumn(options?: InsertWbColumnOptions): ReturnType;
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function gridColumns(layout: WbContainerLayout): string {
  switch (layout) {
    case "left-wide":
      return "2fr 1fr";
    case "right-wide":
      return "1fr 2fr";
    case "equal":
    default:
      return "1fr 1fr";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// wbColumn node  (register BEFORE wbContainer)
// ─────────────────────────────────────────────────────────────────────────────

export const wbColumn = Node.create({
  name: "wbColumn" as const,

  group: "block",
  content: "block+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      /**
       * position: 'left' | 'right'
       * Adds the BEM modifier class and is persisted as data-position.
       */
      position: {
        default: "left" satisfies WbColumnPosition,
        parseHTML: (el: HTMLElement): WbColumnPosition =>
          (el.getAttribute("data-position") as WbColumnPosition) || "left",
        renderHTML: (attrs: WbColumnAttrs) => ({
          "data-position": attrs.position,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.wb-column" }];
  },

  renderHTML({ HTMLAttributes }) {
    const pos: WbColumnPosition =
      (HTMLAttributes["data-position"] as WbColumnPosition) || "left";

    return [
      "div",
      mergeAttributes(
        {
          class: `wb-column wb-column--${pos}`,
          style: [
            /* Layout */
            "display: flex",
            "flex-direction: column",
            "min-height: 80px",
            /* Spacing */
            "padding: 0.75rem",
            /* Visual */
            "border-radius: 0.375rem",
            "background-color: #f8fafc",
            "border: 1px dashed #cbd5e1",
            /* Animation */
            "transition: background-color 0.2s ease, border-color 0.2s ease",
          ].join("; "),
        },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertWbColumn:
        (options: InsertWbColumnOptions = {}) =>
        ({ commands }: CommandProps): boolean =>
          commands.insertContent({
            type: this.name,
            attrs: {
              position: options.position ?? "left",
            } satisfies WbColumnAttrs,
            content: [{ type: "paragraph" }],
          }),
    } satisfies Partial<RawCommands>;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// wbContainer node
// ─────────────────────────────────────────────────────────────────────────────

export const wbContainer = Node.create({
  name: "wbContainer" as const,

  group: "block",
  content: "wbColumn+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      /**
       * layout: 'equal' | 'left-wide' | 'right-wide'
       * Controls the CSS grid-template-columns ratio.
       */
      layout: {
        default: "equal" satisfies WbContainerLayout,
        parseHTML: (el: HTMLElement): WbContainerLayout =>
          (el.getAttribute("data-layout") as WbContainerLayout) || "equal",
        renderHTML: (attrs: WbContainerAttrs) => ({
          "data-layout": attrs.layout,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "section.wb-container" }];
  },

  renderHTML({ HTMLAttributes }) {
    const layout: WbContainerLayout =
      (HTMLAttributes["data-layout"] as WbContainerLayout) || "equal";

    return [
      "section",
      mergeAttributes(
        {
          class: "wb-container",
          style: [
            /* ── Grid layout ───────────────────────────── */
            "display: grid",
            `grid-template-columns: ${gridColumns(layout)}`,
            "gap: 1.5rem",
            /* ── Sizing ────────────────────────────────── */
            "width: 100%",
            "box-sizing: border-box",
            /* ── Spacing ───────────────────────────────── */
            "padding: 1.5rem",
            "margin: 1rem 0",
            /* ── Visual ────────────────────────────────── */
            "background-color: #ffffff",
            "border: 1px solid #e2e8f0",
            "border-radius: 0.5rem",
            "box-shadow: 0 1px 3px rgba(0,0,0,0.06)",
            /* ── Stacking ──────────────────────────────── */
            "position: relative",
          ].join("; "),
        },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertWbContainer:
        (options: InsertWbContainerOptions = {}) =>
        ({ commands }: CommandProps): boolean =>
          commands.insertContent({
            type: this.name,
            attrs: {
              layout: options.layout ?? "equal",
            } satisfies WbContainerAttrs,
            content: [
              {
                type: "wbColumn",
                attrs: { position: "left" } satisfies WbColumnAttrs,
                content: [{ type: "paragraph" }],
              },
              {
                type: "wbColumn",
                attrs: { position: "right" } satisfies WbColumnAttrs,
                content: [{ type: "paragraph" }],
              },
            ],
          }),
    } satisfies Partial<RawCommands>;
  },
});
