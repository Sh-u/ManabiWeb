import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Request, Response } from "express";
import Redis from "ioredis";

export type MyContext = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { userId?: Number } };
  res: Response;
  redis: Redis;
};

export type PitchTypes =
  | "atamadaka"
  | "nakadaka"
  | "odaka"
  | "heiban"
  | "kihuku"
  | "unknown"
  | null;

export type KotuSegmentResponse = [
  [
    {
      partOfSpeech: "名詞" | "助詞" | "動詞" | "形状詞" | "形容詞" | "助動詞" | "補助記号";
      surface: string;
    }
  ]
];

export type KotuParseResponse = [
  {
    accentPhrases: [
      {
  
        components: [
          {
            isBasic: boolean;
            partOfSpeech: string;
            frequency: string;
            original: string;
            originalKana: string;
            partOfSpeechSubtype: string;
            ruby: string;
            pitchAccents: [
              {
                mora: number;
                descriptive: PitchTypes;
              }
            ];
            surfaceOriginal: string;
            surface: string;
            isCompound: boolean;
            kana: string;
          }
        ];
      }
    ];
  }
];

export type JotobaResponse = {
  kanji: [
    {
      literal: string;
      meanings: string[];
      grade: number;
      stroke_count: number;
      frequency: number;
      jlpt: number;
      onyomi: string[];
      kunyomi: string[];
      chinese: string[];
      korean_r: string[];
      korean_h: string[];
      parts: string[];
      radical: string;
      stroke_frames: string;
    }
  ];
  words: [
    {
      reading: {
        kana: string;
        kanji: string;
        furigana: string;
      };
      common: boolean;
      senses: [
        {
          glosses: string[];
          pos: [
            {
              Noun: string;
            },
            {
              Adjective: string;
            }
          ];
          language: string;
        }
      ];
      audio: string;
      pitch: [
        {
          part: string;
          high: boolean;
        },
        {
          part: string;
          high: boolean;
        }
      ];
    }
  ];
};
