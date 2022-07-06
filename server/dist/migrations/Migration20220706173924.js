"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220706173924 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220706173924 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" alter column "kana" type jsonb using ("kana"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "kana" drop not null;');
    }
    async down() {
        this.addSql('alter table "pitch_accent" alter column "kana" type varchar(255) using ("kana"::varchar(255));');
        this.addSql('alter table "pitch_accent" alter column "kana" set not null;');
    }
}
exports.Migration20220706173924 = Migration20220706173924;
//# sourceMappingURL=Migration20220706173924.js.map