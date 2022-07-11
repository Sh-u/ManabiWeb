"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220711115156 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220711115156 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" drop column "high";');
        this.addSql('alter table "pitch_accent" add column "high" jsonb;');
    }
    async down() {
        this.addSql('alter table "pitch_accent" alter column "high" type text[] using ("high"::text[]);');
    }
}
exports.Migration20220711115156 = Migration20220711115156;
//# sourceMappingURL=Migration20220711115156.js.map