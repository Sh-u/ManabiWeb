"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220707183452 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220707183452 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "card" alter column "sentence_arr" type text[] using ("sentence_arr"::text[]);');
    }
    async down() {
        this.addSql('alter table "card" alter column "sentence_arr" type jsonb using ("sentence_arr"::jsonb);');
    }
}
exports.Migration20220707183452 = Migration20220707183452;
//# sourceMappingURL=Migration20220707183452.js.map