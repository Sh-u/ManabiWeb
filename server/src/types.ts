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
  | null;

export type KotuSegmentResponse = [
  [
    {
      partOfSpeech: "名詞" | "助詞" | "動詞";
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
            isCompound: boolean;
            kana: string;
          }
        ];
      }
    ];
  }
];
