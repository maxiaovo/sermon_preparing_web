import type { PrepStage } from "@/generated/prisma/client";

export interface StageInfo {
  key: PrepStage;
  value: string;
  label: string;
  focus: string;
  description: string;
}

export const STAGES: StageInfo[] = [
  {
    key: "PREPARATION" as PrepStage,
    value: "PREPARATION",
    label: "预备心",
    focus: "祷告、选择经文、了解会众需要",
    description:
      "在这个阶段，你要预备自己的心来面对神的话语。思考你为什么要选择这段经文，你的会众当前正面临什么处境。",
  },
  {
    key: "EXEGESIS" as PrepStage,
    value: "EXEGESIS",
    label: "释经",
    focus: "历史与文学背景、原文含义",
    description:
      "现在进入经文本身。观察经文的文体、结构、上下文，思考作者原本要对当时的读者传达什么信息。",
  },
  {
    key: "THEOLOGICAL" as PrepStage,
    value: "THEOLOGICAL",
    label: "神学反思",
    focus: "基督中心解读、救赎历史",
    description:
      "将这段经文放在整本圣经的救赎历史中来看。这段经文如何指向基督？它揭示了神怎样的性情和作为？",
  },
  {
    key: "APPLICATION" as PrepStage,
    value: "APPLICATION",
    label: "应用",
    focus: "连接会众生活",
    description:
      "将经文真理应用到今天的会众生活中。思考你的会众中有哪些不同的群体，他们各自需要从这段经文中听到什么。",
  },
  {
    key: "STRUCTURE" as PrepStage,
    value: "STRUCTURE",
    label: "结构",
    focus: "核心思想、大纲、例证",
    description:
      "现在来组织你的讲道。确定一个核心思想，围绕它来构建讲道大纲。思考什么样的例证和转折能让真理更清晰。",
  },
  {
    key: "DELIVERY" as PrepStage,
    value: "DELIVERY",
    label: "讲道呈现",
    focus: "转折、例证、实践",
    description:
      "最后，思考讲道的实际呈现。你的引言是否能抓住会众的注意力？你的结论是否能激励他们行动？",
  },
];

const STAGE_ORDER: PrepStage[] = [
  "PREPARATION",
  "EXEGESIS",
  "THEOLOGICAL",
  "APPLICATION",
  "STRUCTURE",
  "DELIVERY",
];

export function getStageInfo(stage: string): StageInfo {
  return (
    STAGES.find((s) => s.value === stage) ?? STAGES[0]
  );
}

export function getNextStage(current: string): PrepStage | null {
  const idx = STAGE_ORDER.indexOf(current as PrepStage);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}
