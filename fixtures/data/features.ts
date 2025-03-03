export type FeatureDataType = {
  id: number;
  title: string;
  content: string;
  link?: {
    name: string;
    href: RegExp;
  };
};

export const MOCK_TRADING: FeatureDataType = {
  id: 0,
  title: "Mock Trading",
  content:
    "Welcome to Binance's Mock Trading built on testnet environment. We invite you to learn basic trading skills or test your strategies before moving to Live Trading.",
  link: {
    name: "Start Mock Trading",
    href: /https:\/\/.*binancefuture\.com\/futures\/.*/,
  },
};

export const COLOR_VISION_DEFICIENCY: FeatureDataType = {
  id: 1,
  title: "Color Vision Deficiency",
  content:
    "New friendly Color Vision Deficiency (CVD) theme is added in style settings.",
};

export const MULTI_ASSETS_MODE: FeatureDataType = {
  id: 2,
  title: "Multi-Assets Mode",
  content:
    "With Multi-Assets Mode, users can share multi-assets margin across USDT-margined and BUSD-margined contracts under Cross Margin Mode. One position’s profits can offset losses in another losing position.",
  link: {
    name: "Learn More",
    href: /\/support\/faq\/.*/,
  },
};

export const CHAT_ROOM: FeatureDataType = {
  id: 3,
  title: "Chat Room",
  content:
    "Join us in Futures Chat Room to share your trading ideas with other Futures traders from around the globe.",
};

export const POSITION_LIMIT_ADJUSTMENT: FeatureDataType = {
  id: 4,
  title: "Position Limit Adjustment",
  content:
    "Binance Futures launched the futures position limit self-adjustment tool. Users can visit the position limit page to increase or decrease position limit.",
  link: {
    name: "Learn More",
    href: /\/futures\/position\/adjustment/,
  },
};

export const FEATURES = [
  MOCK_TRADING,
  COLOR_VISION_DEFICIENCY,
  MULTI_ASSETS_MODE,
  CHAT_ROOM,
  POSITION_LIMIT_ADJUSTMENT,
];
