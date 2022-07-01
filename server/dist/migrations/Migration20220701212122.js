"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220701212122 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220701212122 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "card" alter column "dictionary_meaning" type text[] using ("dictionary_meaning"::text[]);');
    }
    async down() {
        this.addSql('alter table "card" alter column "dictionary_meaning" type text using ("dictionary_meaning"::text);');
    }
}
exports.Migration20220701212122 = Migration20220701212122;
//# sourceMappingURL=Migration20220701212122.js.map