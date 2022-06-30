"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220630215018 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220630215018 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "card" alter column "pitch_accent" type text[] using ("pitch_accent"::text[]);');
    }
    async down() {
        this.addSql('alter table "card" alter column "pitch_accent" type text using ("pitch_accent"::text);');
    }
}
exports.Migration20220630215018 = Migration20220630215018;
//# sourceMappingURL=Migration20220630215018.js.map