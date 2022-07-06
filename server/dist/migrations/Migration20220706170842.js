"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220706170842 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220706170842 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" add column "word" jsonb null, add column "kana" varchar(255) not null;');
    }
    async down() {
        this.addSql('alter table "pitch_accent" drop column "word";');
        this.addSql('alter table "pitch_accent" drop column "kana";');
    }
}
exports.Migration20220706170842 = Migration20220706170842;
//# sourceMappingURL=Migration20220706170842.js.map