"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220707175614 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220707175614 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "card" alter column "sentence_arr" type text[] using ("sentence_arr"::text[]);');
        this.addSql('alter table "card" alter column "sentence_arr" drop not null;');
    }
    async down() {
        this.addSql('alter table "card" alter column "sentence_arr" type text[] using ("sentence_arr"::text[]);');
        this.addSql('alter table "card" alter column "sentence_arr" set not null;');
    }
}
exports.Migration20220707175614 = Migration20220707175614;
//# sourceMappingURL=Migration20220707175614.js.map