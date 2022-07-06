"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220706174429 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220706174429 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" drop column "part";');
        this.addSql('alter table "pitch_accent" drop column "high";');
    }
    async down() {
        this.addSql('alter table "pitch_accent" add column "part" jsonb null, add column "high" jsonb null;');
    }
}
exports.Migration20220706174429 = Migration20220706174429;
//# sourceMappingURL=Migration20220706174429.js.map