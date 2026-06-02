"use client";

import { createContext, useContext } from "react";

// The current topic slug for everything rendered inside a topic page shell.
// The lead mounts <TopicProvider> in the TopicPage; consumers (e.g.
// <PracticeSet>) read it via useTopicSlug().
const TopicSlugContext = createContext<string | undefined>(undefined);

export function TopicProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <TopicSlugContext.Provider value={slug}>
      {children}
    </TopicSlugContext.Provider>
  );
}

// Returns the current topic slug, or undefined when no provider is mounted.
// Consumers that require a slug should fall back to an explicit prop.
export function useTopicSlug(): string | undefined {
  return useContext(TopicSlugContext);
}
