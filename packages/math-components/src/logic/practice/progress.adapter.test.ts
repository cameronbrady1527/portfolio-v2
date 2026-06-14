/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import {
  emptyProgress,
  loadProgress,
  recordAnswer,
  saveProgress,
  type Progress,
} from "./progress";

const SLUG = "geometry/transformations/reflections";

afterEach(() => {
  window.localStorage.clear();
});

describe("progress adapter — caller-supplied storage key", () => {
  it("saves under the exact key the caller provides", () => {
    const p = recordAnswer(emptyProgress(), SLUG, "q1", true, 1);
    saveProgress("my-app:progress", p);

    const raw = window.localStorage.getItem("my-app:progress");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toEqual(p);
    // Nothing leaks under any other namespace.
    expect(window.localStorage.getItem("resources:progress")).toBeNull();
  });

  it("loads back what was saved under the same key (round-trip)", () => {
    const p = recordAnswer(emptyProgress(), SLUG, "q1", false, 2);
    saveProgress("consumer:key", p);

    expect(loadProgress("consumer:key")).toEqual(p);
  });

  it("is key-agnostic: two keys hold independent progress", () => {
    const a = recordAnswer(emptyProgress(), SLUG, "q1", true, 1);
    const b = recordAnswer(emptyProgress(), SLUG, "q1", false, 1);
    saveProgress("app-a:progress", a);
    saveProgress("app-b:progress", b);

    expect(loadProgress("app-a:progress")).toEqual(a);
    expect(loadProgress("app-b:progress")).toEqual(b);
  });

  it("returns empty progress when the key has never been written", () => {
    expect(loadProgress("unwritten:key")).toEqual(emptyProgress());
  });

  it("returns empty progress on corrupt stored JSON", () => {
    window.localStorage.setItem("corrupt:key", "{not json");
    expect(loadProgress("corrupt:key")).toEqual<Progress>(emptyProgress());
  });
});
