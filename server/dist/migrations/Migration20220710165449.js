"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220710165449 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220710165449 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" drop column "high";');
        this.addSql('alter table "pitch_accent" add column "high" type text[];');
    }
    async down() {
        this.addSql('alter table "pitch_accent" alter column "high" type text[] using ("high"::text[]);');
    }
}
exports.Migration20220710165449 = Migration20220710165449;
//# sourceMappingURL=Migration20220710165449.js.map