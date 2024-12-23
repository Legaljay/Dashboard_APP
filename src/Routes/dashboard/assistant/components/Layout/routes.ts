import { lazy } from "react";

const AssistantLayout = lazy(() => import("./AssistantLayout"));
const Memory = lazy(() => import("../sections/Memory"));
const Instructions = lazy(() => import("../sections/Instructions"));
const TestLaunch = lazy(() => import("../sections/TestLaunch"));
const AssistantSettings = lazy(() => import("../sections/AssistantSettings"));

export interface AssistantsRoute {
  path: string;
  component: React.LazyExoticComponent<any>;
  label: string;
  icon?: string;
}

export const AssistantsRoutes: Record<string, AssistantsRoute> = {
  Memory: {
    path: "memory",
    component: Memory,
    label: "Memory",
  },
  Instructions: {
    path: "instructions/*",
    component: Instructions,
    label: "Instructions",
  },
  Settings: {
    path: "settings",
    component: AssistantSettings,
    label: "Settings",
  },
  TestLaunch: {
    path: "test-launch",
    component: TestLaunch,
    label: "Test/Launch",
  },
};
