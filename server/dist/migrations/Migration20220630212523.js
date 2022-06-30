"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220630212523 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220630212523 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "card" add column "dictionary_meaning" text null, add column "pitch_accent" text null;');
    }
    async down() {
        this.addSql('alter table "card" drop column "dictionary_meaning";');
        this.addSql('alter table "card" drop column "pitch_accent";');
    }
}
exports.Migration20220630212523 = Migration20220630212523;
//# sourceMappingURL=Migration20220630212523.js.map